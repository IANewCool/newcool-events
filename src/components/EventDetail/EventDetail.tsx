'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { Event } from '@/lib/types'
import { EVENT_TYPE_CONFIG, EVENT_CATEGORY_CONFIG } from '@/lib/types'
import { RSVPButton } from '@/components/RSVPButton/RSVPButton'

interface EventDetailProps {
  event: Event
  onClose: () => void
}

function formatFullDate(date: Date): string {
  return new Date(date).toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
}

function getDuration(start: Date, end: Date): string {
  const diff = new Date(end).getTime() - new Date(start).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 24) return `${Math.floor(hours / 24)} días`
  if (hours > 0) return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`
  return `${minutes}m`
}

export function EventDetail({ event, onClose }: EventDetailProps) {
  const typeConfig = EVENT_TYPE_CONFIG[event.type]
  const categoryConfig = EVENT_CATEGORY_CONFIG[event.category]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700"
      >
        {/* Header */}
        <div className={`h-32 bg-gradient-to-br ${typeConfig.color} flex items-center justify-center relative`}>
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl"
          >
            {event.coverEmoji}
          </motion.span>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            ×
          </button>
          {event.isFeatured && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-black text-sm font-bold rounded-lg">
              ⭐ Destacado
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Type & Category */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 bg-gradient-to-r ${typeConfig.color} text-white text-sm rounded-lg flex items-center gap-1`}>
              {typeConfig.emoji} {typeConfig.label}
            </span>
            <span className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-lg flex items-center gap-1">
              {categoryConfig.emoji} {categoryConfig.label}
            </span>
            {event.isRecurring && (
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-lg">
                🔄 {event.recurringPattern}
              </span>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
            <p className="text-gray-400">{event.description}</p>
          </div>

          {/* Date, Time, Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/30 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Fecha y hora</div>
              <div className="text-white font-medium">{formatFullDate(event.startDate)}</div>
              <div className="text-gray-400">
                {formatTime(event.startDate)} - {formatTime(event.endDate)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Duración: {getDuration(event.startDate, event.endDate)} • {event.timezone}
              </div>
            </div>

            <div className="bg-gray-700/30 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">Ubicación</div>
              {event.type === 'virtual' ? (
                <div>
                  <div className="text-white font-medium">💻 Evento virtual</div>
                  {event.virtualUrl && (
                    <a href={event.virtualUrl} target="_blank" rel="noopener noreferrer"
                       className="text-cyan-400 text-sm hover:underline">
                      Unirse al evento →
                    </a>
                  )}
                </div>
              ) : (
                <div>
                  <div className="text-white font-medium">📍 {event.location}</div>
                  {event.virtualUrl && (
                    <div className="text-sm text-gray-400 mt-1">
                      También disponible virtual
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Speakers */}
          {event.speakers.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-400 mb-3">Ponentes</div>
              <div className="flex flex-wrap gap-3">
                {event.speakers.map((speaker) => (
                  <div key={speaker.id} className="flex items-center gap-3 bg-gray-700/30 rounded-xl p-3">
                    <div className="text-3xl">{speaker.avatarEmoji}</div>
                    <div>
                      <div className="text-white font-medium">{speaker.name}</div>
                      <div className="text-xs text-gray-400">{speaker.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-700/50 text-gray-400 text-sm rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Attendees & Capacity */}
          <div className="flex items-center justify-between bg-gray-700/30 rounded-xl p-4">
            <div>
              <div className="text-2xl font-bold text-white">{event.currentAttendees}</div>
              <div className="text-xs text-gray-500">
                {event.maxAttendees ? `de ${event.maxAttendees} lugares` : 'asistentes'}
              </div>
            </div>
            {event.maxAttendees && (
              <div className="flex-1 mx-4">
                <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
                    className={`h-full ${
                      event.currentAttendees >= event.maxAttendees
                        ? 'bg-red-500'
                        : event.currentAttendees >= event.maxAttendees * 0.8
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {event.maxAttendees - event.currentAttendees} lugares disponibles
                </div>
              </div>
            )}
          </div>

          {/* RSVP */}
          <RSVPButton
            eventId={event.id}
            maxAttendees={event.maxAttendees}
            currentAttendees={event.currentAttendees}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
