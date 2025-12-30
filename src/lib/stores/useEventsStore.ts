import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { t12EventBus, T12_EVENTS } from '@newcool/t12-shared'
import type { EventRSVPPayload } from '@newcool/t12-shared'
import type { Event, UserRSVP, EventStats, RSVPStatus, EventType, EventCategory } from '@/lib/types'

interface EventsState {
  events: Event[]
  userRSVPs: UserRSVP[]

  // Actions
  addEvent: (event: Omit<Event, 'id' | 'currentAttendees' | 'createdAt'>) => void
  updateRSVP: (eventId: string, status: RSVPStatus, reminder?: boolean) => void
  toggleReminder: (eventId: string) => void

  // Computed
  getStats: () => EventStats
  getUpcomingEvents: () => Event[]
  getEventsByType: (type: EventType) => Event[]
  getEventsByCategory: (category: EventCategory) => Event[]
  getFeaturedEvents: () => Event[]
  getUserRSVP: (eventId: string) => UserRSVP | undefined
  getMyEvents: () => Event[]
}

// Demo events
const now = new Date()
const demoEvents: Event[] = [
  {
    id: 'evt-1',
    title: 'Introducción a la Programación con Python',
    description: 'Aprende los fundamentos de programación con Python desde cero. Ideal para principiantes.',
    type: 'virtual',
    category: 'webinar',
    coverEmoji: '🐍',
    startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2), // 2 days
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 90),
    timezone: 'America/Santiago',
    virtualUrl: 'https://meet.newcool.io/python-intro',
    maxAttendees: 100,
    currentAttendees: 67,
    speakers: [{ id: 's1', name: 'María García', role: 'Senior Developer', avatarEmoji: '👩‍💻' }],
    tags: ['python', 'programación', 'principiantes'],
    isFeatured: true,
    isRecurring: false,
    createdAt: new Date()
  },
  {
    id: 'evt-2',
    title: 'Hackathon NewCool 2025',
    description: '48 horas de innovación. Crea soluciones educativas que impacten a miles de estudiantes.',
    type: 'hybrid',
    category: 'hackathon',
    coverEmoji: '🏆',
    startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7), // 7 days
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 9),
    timezone: 'America/Santiago',
    location: 'Santiago, Chile + Virtual',
    virtualUrl: 'https://meet.newcool.io/hackathon-2025',
    maxAttendees: 500,
    currentAttendees: 342,
    speakers: [
      { id: 's2', name: 'Carlos Ruiz', role: 'CTO NewCool', avatarEmoji: '👨‍💼' },
      { id: 's3', name: 'Ana López', role: 'Product Lead', avatarEmoji: '👩‍🎨' }
    ],
    tags: ['hackathon', 'innovación', 'premios'],
    isFeatured: true,
    isRecurring: false,
    createdAt: new Date()
  },
  {
    id: 'evt-3',
    title: 'Office Hours: Matemáticas',
    description: 'Sesión semanal de preguntas y respuestas sobre matemáticas con nuestros tutores.',
    type: 'virtual',
    category: 'office_hours',
    coverEmoji: '📐',
    startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24), // Tomorrow
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 + 1000 * 60 * 60),
    timezone: 'America/Santiago',
    virtualUrl: 'https://meet.newcool.io/math-office',
    currentAttendees: 23,
    speakers: [{ id: 's4', name: 'Pedro Soto', role: 'Tutor de Matemáticas', avatarEmoji: '🧮' }],
    tags: ['matemáticas', 'tutorías', 'preguntas'],
    isFeatured: false,
    isRecurring: true,
    recurringPattern: 'weekly',
    createdAt: new Date()
  },
  {
    id: 'evt-4',
    title: 'Taller: Creación de Contenido Educativo',
    description: 'Aprende a crear contenido educativo atractivo y efectivo para tus estudiantes.',
    type: 'presential',
    category: 'workshop',
    coverEmoji: '🎨',
    startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 5), // 5 days
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 180),
    timezone: 'America/Santiago',
    location: 'Biblioteca Nacional, Santiago',
    maxAttendees: 30,
    currentAttendees: 28,
    speakers: [{ id: 's5', name: 'Sofía Mendez', role: 'Diseñadora Instruccional', avatarEmoji: '✨' }],
    tags: ['contenido', 'diseño', 'profesores'],
    isFeatured: false,
    isRecurring: false,
    createdAt: new Date()
  },
  {
    id: 'evt-5',
    title: 'Meetup Comunidad NewCool - Valparaíso',
    description: 'Únete a la comunidad NewCool en Valparaíso. Networking, charlas y sorpresas.',
    type: 'presential',
    category: 'meetup',
    coverEmoji: '🌊',
    startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14), // 14 days
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 180),
    timezone: 'America/Santiago',
    location: 'Cowork Valparaíso',
    maxAttendees: 50,
    currentAttendees: 31,
    speakers: [],
    tags: ['meetup', 'networking', 'valparaíso'],
    isFeatured: false,
    isRecurring: false,
    createdAt: new Date()
  },
  {
    id: 'evt-6',
    title: 'Lanzamiento: NewCool Science',
    description: 'Presentación oficial de nuestra nueva plataforma de ciencias interactiva.',
    type: 'virtual',
    category: 'launch',
    coverEmoji: '🔬',
    startDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 10), // 10 days
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 10 + 1000 * 60 * 60),
    timezone: 'America/Santiago',
    virtualUrl: 'https://meet.newcool.io/science-launch',
    currentAttendees: 156,
    speakers: [
      { id: 's6', name: 'Dr. Alejandro Torres', role: 'Director Científico', avatarEmoji: '🔭' }
    ],
    tags: ['lanzamiento', 'ciencias', 'nuevo'],
    isFeatured: true,
    isRecurring: false,
    createdAt: new Date()
  }
]

export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      events: demoEvents,
      userRSVPs: [
        { eventId: 'evt-1', status: 'going', registeredAt: new Date(), reminder: true },
        { eventId: 'evt-2', status: 'interested', registeredAt: new Date(), reminder: false }
      ],

      addEvent: (event) => {
        const newEvent: Event = {
          ...event,
          id: `evt-${Date.now()}`,
          currentAttendees: 0,
          createdAt: new Date()
        }
        set((state) => ({ events: [newEvent, ...state.events] }))
      },

      updateRSVP: (eventId, status, reminder = false) => {
        const event = get().events.find((e) => e.id === eventId)

        set((state) => {
          const existing = state.userRSVPs.find((r) => r.eventId === eventId)
          const events = state.events.map((e) => {
            if (e.id !== eventId) return e
            let delta = 0
            if (status === 'going' && existing?.status !== 'going') delta = 1
            if (status !== 'going' && existing?.status === 'going') delta = -1
            return { ...e, currentAttendees: Math.max(0, e.currentAttendees + delta) }
          })

          if (existing) {
            return {
              events,
              userRSVPs: state.userRSVPs.map((r) =>
                r.eventId === eventId ? { ...r, status, reminder } : r
              )
            }
          }
          return {
            events,
            userRSVPs: [...state.userRSVPs, { eventId, status, registeredAt: new Date(), reminder }]
          }
        })

        // Emit T12 event for cross-module communication
        if (t12EventBus.isReady() && event) {
          const payload: EventRSVPPayload = {
            eventId,
            eventTitle: event.title,
            status,
            reminder,
            startDate: new Date(event.startDate).toISOString()
          }
          t12EventBus.publish(T12_EVENTS.EVENT_RSVP, payload)
        }
      },

      toggleReminder: (eventId) => {
        set((state) => ({
          userRSVPs: state.userRSVPs.map((r) =>
            r.eventId === eventId ? { ...r, reminder: !r.reminder } : r
          )
        }))
      },

      getStats: () => {
        const events = get().events
        const now = new Date()
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

        const byType = {} as Record<EventType, number>
        const byCategory = {} as Record<EventCategory, number>

        events.forEach((e) => {
          byType[e.type] = (byType[e.type] || 0) + 1
          byCategory[e.category] = (byCategory[e.category] || 0) + 1
        })

        return {
          total: events.length,
          upcoming: events.filter((e) => new Date(e.startDate) > now).length,
          thisWeek: events.filter((e) => new Date(e.startDate) > now && new Date(e.startDate) <= weekFromNow).length,
          thisMonth: events.filter((e) => new Date(e.startDate) > now && new Date(e.startDate) <= monthFromNow).length,
          byType,
          byCategory
        }
      },

      getUpcomingEvents: () => {
        const now = new Date()
        return get().events
          .filter((e) => new Date(e.startDate) > now)
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      },

      getEventsByType: (type) => get().events.filter((e) => e.type === type),
      getEventsByCategory: (category) => get().events.filter((e) => e.category === category),
      getFeaturedEvents: () => get().events.filter((e) => e.isFeatured),
      getUserRSVP: (eventId) => get().userRSVPs.find((r) => r.eventId === eventId),
      getMyEvents: () => {
        const goingIds = get().userRSVPs.filter((r) => r.status === 'going').map((r) => r.eventId)
        return get().events.filter((e) => goingIds.includes(e.id))
      }
    }),
    { name: 'newcool-events-storage' }
  )
)
