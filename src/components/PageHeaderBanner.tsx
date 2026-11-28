'use client'

import React from 'react'

type BannerTone = 'emerald' | 'amber'

interface PageHeaderBannerProps
  extends Omit<React.ComponentPropsWithoutRef<'section'>, 'title' | 'children'> {
  tone?: BannerTone
  badge: string
  title: React.ReactNode
  description: React.ReactNode
  rightSlot?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}

const TONE_STYLES: Record<
  BannerTone,
  {
    surface: string
    dot: string
    badgeText: string
    badgeBg: string
  }
> = {
  emerald: {
    surface:
      'bg-gradient-to-br from-emerald-500/12 via-white/95 to-teal-500/10 border-emerald-600/25 dark:from-emerald-500/15 dark:via-gray-900/95 dark:to-teal-500/10 dark:border-emerald-500/25',
    dot: 'bg-emerald-500',
    badgeText: 'text-emerald-700 dark:text-emerald-400',
    badgeBg: 'bg-emerald-500/12 border-emerald-600/25 dark:border-emerald-500/30',
  },
  amber: {
    surface:
      'bg-gradient-to-br from-amber-500/14 via-white/95 to-yellow-400/10 border-amber-600/25 dark:from-amber-500/15 dark:via-gray-900/95 dark:to-yellow-500/10 dark:border-amber-500/25',
    dot: 'bg-amber-500',
    badgeText: 'text-amber-700 dark:text-amber-400',
    badgeBg: 'bg-amber-500/12 border-amber-600/25 dark:border-amber-500/30',
  },
}

export function PageHeaderBanner({
  tone = 'emerald',
  badge,
  title,
  description,
  rightSlot,
  align = 'left',
  className = '',
  ...rest
}: PageHeaderBannerProps) {
  const style = TONE_STYLES[tone]
  const isCentered = align === 'center' && !rightSlot

  return (
    <section
      {...rest}
      className={`border rounded-3xl p-5 sm:p-6 md:p-7 shadow-xs dark:shadow-none ${style.surface} ${className}`}
    >
      <div
        className={`flex flex-col ${
          rightSlot ? 'lg:flex-row lg:items-center lg:justify-between gap-5' : 'gap-2.5'
        } ${isCentered ? 'items-center text-center' : 'text-left'}`}
      >
        <div className="space-y-2 max-w-2xl">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${style.badgeBg}`}
          >
            <span className={`h-2 w-2 rounded-full ${style.dot}`} />
            <span
              className={`text-[10px] font-black uppercase tracking-[0.14em] ${style.badgeText}`}
            >
              {badge}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-stone-900 dark:text-white leading-tight">
            {title}
          </h2>

          <p className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-stone-600 dark:text-gray-400">
            {description}
          </p>
        </div>

        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>
    </section>
  )
}