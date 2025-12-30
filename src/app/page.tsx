'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EventCard } from '@/components/EventCard/EventCard'
import { EventFilters } from '@/components/EventFilters/EventFilters'
import { EventDetail } from '@/components/EventDetail/EventDetail'
import { T12Provider } from '@/components/T12Provider'
import { useEventsStore } from '@/lib/stores/useEventsStore'
import type { Event, EventType, EventCategory } from '@/lib/types'

type Tab = 'upcoming' | 'my_events' | 'featured'

export default function EventsDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [typeFilter, setTypeFilter] = useState<EventType | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all')

  const { getUpcomingEvents, getMyEvents, getFeaturedEvents, getStats } = useEventsStore()
  const stats = getStats()

  const getFilteredEvents = () => {
    let events: Event[]
    switch (activeTab) {
      case 'my_events': events = getMyEvents(); break
      case 'featured': events = getFeaturedEvents(); break
      default: events = getUpcomingEvents()
    }

    return events.filter((e) => {
      if (typeFilter !== 'all' && e.type !== typeFilter) return false
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false
      return true
    })
  }

  const filteredEvents = getFilteredEvents()

  const tabs = [
    { id: 'upcoming', label: 'Próximos', emoji: '📅', count: stats.upcoming },
    { id: 'my_events', label: 'Mis Eventos', emoji: '🎟️', count: getMyEvents().length },
    { id: 'featured', label: 'Destacados', emoji: '⭐', count: getFeaturedEvents().length },
  ]

  return (
    <T12Provider>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900/20 to-emerald-900/20">
      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900/80 via-teal-900/40 to-emerald-900/40 backdrop-blur-xl border-b border-teal-500/20 p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-5xl"
            >
              🎉
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
                NewCool Events
              </h1>
              <p className="text-gray-400 mt-1">
                Eventos de Comunidad | T12-COMMUNITY
              </p>
            </div>

            {/* Quick stats */}
            <div className="ml-auto flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-400">{stats.thisWeek}</div>
                <div className="text-xs text-gray-500">Esta semana</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{stats.thisMonth}</div>
                <div className="text-xs text-gray-500">Este mes</div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
              <span className="px-2 py-0.5 bg-black/20 rounded-full text-xs">{tab.count}</span>
            </motion.button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-4 backdrop-blur-xl border border-gray-700/50 mb-6">
          <EventFilters
            selectedType={typeFilter}
            selectedCategory={categoryFilter}
            onTypeChange={setTypeFilter}
            onCategoryChange={setCategoryFilter}
          />
        </div>

        {/* Events Grid */}
        <motion.div
          key={`${activeTab}-${typeFilter}-${categoryFilter}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16 text-gray-500"
              >
                <div className="text-6xl mb-4">📭</div>
                <p className="text-lg">No hay eventos en esta categoría</p>
                <p className="text-sm mt-2">Prueba cambiando los filtros</p>
              </motion.div>
            ) : (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-6 backdrop-blur-xl border border-gray-700/50"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📊</span> Resumen de Eventos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-500/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{stats.byType.virtual || 0}</div>
              <div className="text-xs text-gray-400">💻 Virtuales</div>
            </div>
            <div className="bg-green-500/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{stats.byType.presential || 0}</div>
              <div className="text-xs text-gray-400">📍 Presenciales</div>
            </div>
            <div className="bg-purple-500/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">{stats.byType.hybrid || 0}</div>
              <div className="text-xs text-gray-400">🔄 Híbridos</div>
            </div>
            <div className="bg-yellow-500/20 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">{stats.total}</div>
              <div className="text-xs text-gray-400">📅 Total</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>NewCool Events | T12-COMMUNITY | Conectando la comunidad</p>
      </footer>
    </div>
    </T12Provider>
  )
}
