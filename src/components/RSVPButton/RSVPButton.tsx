'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RSVPStatus } from '@/lib/types'
import { RSVP_CONFIG } from '@/lib/types'
import { useEventsStore } from '@/lib/stores/useEventsStore'

interface RSVPButtonProps {
  eventId: string
  maxAttendees?: number
  currentAttendees: number
}

export function RSVPButton({ eventId, maxAttendees, currentAttendees }: RSVPButtonProps) {
  const [showOptions, setShowOptions] = useState(false)
  const { getUserRSVP, updateRSVP, toggleReminder } = useEventsStore()
  const userRSVP = getUserRSVP(eventId)

  const isFull = maxAttendees ? currentAttendees >= maxAttendees : false

  const handleRSVP = (status: RSVPStatus) => {
    updateRSVP(eventId, status, status === 'going')
    setShowOptions(false)
  }

  if (userRSVP?.status === 'going') {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex-1 py-3 bg-green-500/20 text-green-400 rounded-xl font-medium text-center"
          >
            ✅ ¡Inscrito!
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleReminder(eventId)}
            className={`p-3 rounded-xl ${
              userRSVP.reminder
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-gray-700/30 text-gray-400'
            }`}
            title={userRSVP.reminder ? 'Recordatorio activo' : 'Activar recordatorio'}
          >
            🔔
          </motion.button>
        </div>
        <button
          onClick={() => handleRSVP('not_going')}
          className="w-full py-2 text-sm text-gray-500 hover:text-red-400 transition-colors"
        >
          Cancelar inscripción
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowOptions(!showOptions)}
        disabled={isFull && !userRSVP}
        className={`w-full py-3 rounded-xl font-medium transition-all ${
          isFull
            ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'
        }`}
      >
        {isFull ? '🚫 Evento lleno' : userRSVP?.status === 'interested' ? '⭐ Interesado' : '🎟️ Inscribirse'}
      </motion.button>

      <AnimatePresence>
        {showOptions && !isFull && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden z-10"
          >
            {(['going', 'interested', 'not_going'] as const).map((status) => {
              const config = RSVP_CONFIG[status]
              return (
                <motion.button
                  key={status}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  onClick={() => handleRSVP(status)}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 text-white"
                >
                  <span>{config.emoji}</span>
                  <span>{config.label}</span>
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
