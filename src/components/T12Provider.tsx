'use client'

import { useT12Init } from '@newcool/t12-shared'

export function T12Provider({ children }: { children: React.ReactNode }) {
  useT12Init('events')
  return <>{children}</>
}
