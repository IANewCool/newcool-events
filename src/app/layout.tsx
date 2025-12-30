import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NewCool Events',
  description: 'Eventos Virtuales y Presenciales - T12 Community',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
