# CLAUDE.md - NewCool Events

## Identidad del Modulo

```
MODULO: newcool-events
DEPARTAMENTO: T12-COMMUNITY
ROL: Sistema de Eventos Virtuales y Presenciales
DOMINIO: events.newcool.io
PUERTO: 3017
```

## Descripcion

Sistema completo de gestion de eventos de comunidad:
- **Virtuales**: Webinars, Office Hours, Lanzamientos
- **Presenciales**: Talleres, Meetups, Conferencias
- **Hibridos**: Eventos con asistencia mixta
- **RSVP**: Sistema de inscripcion y recordatorios
- **Calendario**: Vista de eventos por fecha

## Componentes Principales

| Componente | Funcion | Archivo |
|------------|---------|---------|
| `EventCard` | Tarjeta de evento con preview | `components/EventCard/EventCard.tsx` |
| `EventFilters` | Filtros por tipo y categoria | `components/EventFilters/EventFilters.tsx` |
| `EventDetail` | Modal con detalle completo | `components/EventDetail/EventDetail.tsx` |
| `RSVPButton` | Boton de inscripcion | `components/RSVPButton/RSVPButton.tsx` |

## Tipos de Evento

```yaml
tipos:
  virtual:
    emoji: "💻"
    descripcion: "100% online"
  presential:
    emoji: "📍"
    descripcion: "En persona"
  hybrid:
    emoji: "🔄"
    descripcion: "Online + presencial"
```

## Categorias

```yaml
categorias:
  webinar: "🎥 Webinars educativos"
  workshop: "🛠️ Talleres practicos"
  meetup: "👥 Encuentros de comunidad"
  hackathon: "💡 Hackathons"
  conference: "🎤 Conferencias"
  launch: "🚀 Lanzamientos"
  training: "📚 Capacitaciones"
  office_hours: "☕ Office hours con expertos"
```

## Sistema RSVP

```yaml
estados:
  going: "✅ Asistire"
  interested: "⭐ Interesado"
  not_going: "❌ No asistire"

funcionalidades:
  - Inscripcion con un click
  - Recordatorios configurables
  - Cancelacion facil
  - Contador de asistentes
  - Lista de espera (si lleno)
```

## Stack Tecnologico

```
Frontend: Next.js 15, React 19
Animaciones: Framer Motion
Estado: Zustand (persistente en localStorage)
Estilos: Tailwind CSS 4
Puerto: 3017
```

## Estructura de Archivos

```
newcool-events/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── EventCard/
│   │   ├── EventFilters/
│   │   ├── EventDetail/
│   │   └── RSVPButton/
│   └── lib/
│       ├── stores/
│       │   └── useEventsStore.ts
│       └── types/
│           └── index.ts
├── package.json
└── CLAUDE.md
```

## Comandos

```bash
# Desarrollo
npm run dev    # http://localhost:3017

# Build
npm run build

# Produccion
npm run start
```

## Integracion con T12-COMMUNITY

```yaml
recibe_de:
  - newcool-community: datos de usuarios
  - newcool-cerebro: preferencias de usuarios

provee_a:
  - newcool-notifications: recordatorios de eventos
  - newcool-gamification: badges por asistencia
  - newcool-analytics: metricas de participacion
  - newcool-impact: datos de engagement
```

## API Endpoints (Planificados)

```yaml
GET /api/events:
  description: "Lista de eventos"
  query: { type, category, from, to }

GET /api/events/{id}:
  description: "Detalle de evento"

POST /api/events:
  description: "Crear evento"
  body: Event

POST /api/events/{id}/rsvp:
  description: "Registrar RSVP"
  body: { status, reminder }

GET /api/events/my:
  description: "Mis eventos inscritos"

GET /api/events/calendar:
  description: "Vista calendario"
  query: { month, year }
```

## Eventos Recurrentes

```yaml
patrones:
  weekly: "Cada semana"
  biweekly: "Cada 2 semanas"
  monthly: "Cada mes"

configuracion:
  - Dia y hora fijos
  - Excepcion de fechas
  - Fin de recurrencia
```

## Metricas de Exito

| Metrica | Target | Critico |
|---------|--------|---------|
| Tasa de asistencia | >70% | <40% |
| RSVP conversion | >30% | <10% |
| Eventos por mes | >10 | <3 |
| NPS post-evento | >50 | <20 |
| Repeat attendees | >40% | <15% |

## Principios de Diseno

```
1. Facil descubrimiento - Eventos relevantes primero
2. Un click para inscribirse
3. Recordatorios no invasivos
4. Transparencia en capacidad
5. Accesibilidad - Siempre opcion virtual
```

## Conectividad Rural

```yaml
estrategia:
  - Eventos grabados disponibles offline
  - SMS para recordatorios criticos
  - Baja latencia en streams
  - Audio-only como fallback
```

## Prohibiciones

```
- NO eventos sin descripcion clara
- NO ocultar limitaciones de capacidad
- NO spam de recordatorios
- NO cancelar sin notificar
- NO discriminar por ubicacion
```

**Mantra: "Conectando la comunidad, un evento a la vez."**
