export type EventType = 'virtual' | 'presential' | 'hybrid'

export type EventCategory =
  | 'webinar'      // Webinars educativos
  | 'workshop'     // Talleres prácticos
  | 'meetup'       // Encuentros de comunidad
  | 'hackathon'    // Hackathons
  | 'conference'   // Conferencias
  | 'launch'       // Lanzamientos
  | 'training'     // Capacitaciones
  | 'office_hours' // Office hours con expertos

export type RSVPStatus = 'going' | 'interested' | 'not_going' | null

export interface EventSpeaker {
  id: string
  name: string
  role: string
  avatarEmoji: string
  bio?: string
}

export interface Event {
  id: string
  title: string
  description: string
  type: EventType
  category: EventCategory
  coverEmoji: string
  startDate: Date
  endDate: Date
  timezone: string
  location?: string           // Para presenciales
  virtualUrl?: string         // Para virtuales
  maxAttendees?: number
  currentAttendees: number
  speakers: EventSpeaker[]
  tags: string[]
  isFeatured: boolean
  isRecurring: boolean
  recurringPattern?: string   // "weekly", "monthly"
  createdAt: Date
}

export interface UserRSVP {
  eventId: string
  status: RSVPStatus
  registeredAt: Date
  reminder: boolean
}

export interface EventStats {
  total: number
  upcoming: number
  thisWeek: number
  thisMonth: number
  byType: Record<EventType, number>
  byCategory: Record<EventCategory, number>
}

// Configurations
export const EVENT_TYPE_CONFIG: Record<EventType, { label: string; emoji: string; color: string }> = {
  virtual: { label: 'Virtual', emoji: '💻', color: 'from-blue-500 to-cyan-500' },
  presential: { label: 'Presencial', emoji: '📍', color: 'from-green-500 to-emerald-500' },
  hybrid: { label: 'Híbrido', emoji: '🔄', color: 'from-purple-500 to-pink-500' }
}

export const EVENT_CATEGORY_CONFIG: Record<EventCategory, { label: string; emoji: string }> = {
  webinar: { label: 'Webinar', emoji: '🎥' },
  workshop: { label: 'Taller', emoji: '🛠️' },
  meetup: { label: 'Meetup', emoji: '👥' },
  hackathon: { label: 'Hackathon', emoji: '💡' },
  conference: { label: 'Conferencia', emoji: '🎤' },
  launch: { label: 'Lanzamiento', emoji: '🚀' },
  training: { label: 'Capacitación', emoji: '📚' },
  office_hours: { label: 'Office Hours', emoji: '☕' }
}

export const RSVP_CONFIG: Record<NonNullable<RSVPStatus>, { label: string; emoji: string; color: string }> = {
  going: { label: 'Asistiré', emoji: '✅', color: 'bg-green-500' },
  interested: { label: 'Interesado', emoji: '⭐', color: 'bg-yellow-500' },
  not_going: { label: 'No asistiré', emoji: '❌', color: 'bg-gray-500' }
}
