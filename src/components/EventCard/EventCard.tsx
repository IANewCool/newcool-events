'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { Event } from '@/lib/types'
import { EVENT_TYPE_CONFIG, EVENT_CATEGORY_CONFIG } from '@/lib/types'
import { useEventsStore } from '@/lib/stores/useEventsStore'

interface EventCardProps {
  event: Event
  onClick: () => void
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getDaysUntil(date: Date): number {
  const now = new Date()
  const diff = new Date(date).getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function EventCard({ event, onClick }: EventCardProps) {
  const typeConfig = EVENT_TYPE_CONFIG[event.type]
  const categoryConfig = EVENT_CATEGORY_CONFIG[event.category]
  const { getUserRSVP } = useEventsStore()
  const userRSVP = getUserRSVP(event.id)
  const daysUntil = getDaysUntil(event.startDate)

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl overflow-hidden border border-gray-700/50 ${
        event.isFeatured ? 'ring-2 ring-yellow-500/30' : ''
      }`}
    >
      {/* Header with emoji */}
      <div className={`h-24 bg-gradient-to-br ${typeConfig.color} flex items-center justify-center relative`}>
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl"
        >
          {event.coverEmoji}
        </motion.span>

        {/* Featured badge */}
        {event.isFeatured && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded-lg">
            ⭐ Destacado
          </div>
        )}

        {/* Type badge */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-xs text-white flex items-center gap-1">
          <span>{typeConfig.emoji}</span>
          <span>{typeConfig.label}</span>
        </div>

        {/* Days until */}
        {daysUntil > 0 && daysUntil <= 7 && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-xs text-cyan-400">
            {daysUntil === 1 ? 'Mañana' : `En ${daysUntil} días`}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">{categoryConfig.emoji}</span>
          <span className="text-xs text-gray-400">{categoryConfig.label}</span>
          {event.isRecurring && (
            <span className="text-xs text-purple-400 ml-auto">🔄 Recurrente</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-white mb-2 line-clamp-2">{event.title}</h3>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
          <span>📅</span>
          <span>{formatDate(event.startDate)}</span>
          <span>•</span>
          <span>🕐</span>
          <span>{formatTime(event.startDate)}</span>
        </div>

        {/* Location or Virtual */}
        <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
          {event.type === 'virtual' ? (
            <>
              <span>💻</span>
              <span>Evento virtual</span>
            </>
          ) : (
            <>
              <span>📍</span>
              <span className="truncate">{event.location}</span>
            </>
          )}
        </div>

        {/* Attendees */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {event.speakers.slice(0, 3).map((speaker) => (
                <div
                  key={speaker.id}
                  className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-sm border-2 border-gray-800"
                >
                  {speaker.avatarEmoji}
                </div>
              ))}
            </div>
            <span className="text-xs text-gray-400">
              {event.currentAttendees} asistentes
            </span>
          </div>

          {/* RSVP indicator */}
          {userRSVP?.status === 'going' && (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg">
              ✅ Inscrito
            </span>
          )}
          {userRSVP?.status === 'interested' && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-lg">
              ⭐ Interesado
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
