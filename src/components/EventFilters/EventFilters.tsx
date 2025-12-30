'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { EventType, EventCategory } from '@/lib/types'
import { EVENT_TYPE_CONFIG, EVENT_CATEGORY_CONFIG } from '@/lib/types'

interface EventFiltersProps {
  selectedType: EventType | 'all'
  selectedCategory: EventCategory | 'all'
  onTypeChange: (type: EventType | 'all') => void
  onCategoryChange: (category: EventCategory | 'all') => void
}

export function EventFilters({ selectedType, selectedCategory, onTypeChange, onCategoryChange }: EventFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Type filters */}
      <div>
        <div className="text-xs text-gray-500 mb-2">Tipo</div>
        <div className="flex gap-2 flex-wrap">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onTypeChange('all')}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              selectedType === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'bg-gray-700/30 text-gray-400'
            }`}
          >
            Todos
          </motion.button>
          {(Object.entries(EVENT_TYPE_CONFIG) as [EventType, typeof EVENT_TYPE_CONFIG[EventType]][]).map(
            ([type, config]) => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTypeChange(type)}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                  selectedType === type
                    ? `bg-gradient-to-r ${config.color} text-white`
                    : 'bg-gray-700/30 text-gray-400'
                }`}
              >
                <span>{config.emoji}</span>
                <span>{config.label}</span>
              </motion.button>
            )
          )}
        </div>
      </div>

      {/* Category filters */}
      <div>
        <div className="text-xs text-gray-500 mb-2">Categoría</div>
        <div className="flex gap-2 flex-wrap">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange('all')}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'bg-gray-700/30 text-gray-400'
            }`}
          >
            Todas
          </motion.button>
          {(Object.entries(EVENT_CATEGORY_CONFIG) as [EventCategory, typeof EVENT_CATEGORY_CONFIG[EventCategory]][]).map(
            ([category, config]) => (
              <motion.button
                key={category}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(category)}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-gray-700/30 text-gray-400'
                }`}
              >
                <span>{config.emoji}</span>
                <span>{config.label}</span>
              </motion.button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
