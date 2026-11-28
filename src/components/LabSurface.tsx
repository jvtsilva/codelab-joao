'use client'

import React from 'react'

type SurfaceVariant = 'card' | 'subtle' | 'emerald' | 'amber' | 'danger'

interface LabSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: SurfaceVariant
  className?: string
}

const VARIANT_CLASSES: Record<SurfaceVariant, string> = {
  card: 'bg-white/95 border-stone-200/90 text-stone-900 shadow-xs dark:bg-gray-900/90 dark:border-gray-800/90 dark:text-white dark:shadow-none',
  subtle:
    'bg-stone-50/90 border-stone-200/90 text-stone-900 dark:bg-gray-950/70 dark:border-gray-800 dark:text-white',
  emerald:
    'bg-gradient-to-br from-emerald-500/10 via-white/95 to-teal-500/5 border-emerald-600/25 text-stone-900 shadow-xs dark:from-emerald-500/12 dark:via-gray-900/90 dark:to-teal-500/5 dark:border-emerald-500/25 dark:text-white dark:shadow-none',
  amber:
    'bg-gradient-to-br from-amber-500/10 via-white/95 to-yellow-400/5 border-amber-600/25 text-stone-900 shadow-xs dark:from-amber-500/12 dark:via-gray-900/90 dark:to-yellow-500/5 dark:border-amber-500/25 dark:text-white dark:shadow-none',
  danger:
    'bg-white/95 border-red-600/25 text-stone-900 shadow-xs dark:bg-gray-900/90 dark:border-red-500/25 dark:text-white dark:shadow-none',
}

export function LabSurface({
  children,
  variant = 'card',
  className = '',
  ...rest
}: LabSurfaceProps) {
  return (
    <div
      {...rest}
      className={`border rounded-3xl ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </div>
  )
}