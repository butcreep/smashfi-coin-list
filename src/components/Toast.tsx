'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number
}

export default function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className="fixed top-6 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 px-4 sm:px-0 animate-slide-up"
      role="status"
      aria-live="polite"
    >
      <div
        className="flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-lg backdrop-blur"
        style={{
          background:
            'linear-gradient(135deg, rgba(7,12,24,0.92), rgba(3,5,12,0.92))',
          border: '1px solid rgba(148,163,184,0.25)',
          color: 'var(--toast-fg)',
          boxShadow: 'var(--shadow-soft)'
        }}
      >
        <div
          className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full"
          style={{
            background: 'rgba(34, 197, 94, 0.18)',
            border: '1px solid rgba(34,197,94,0.35)'
          }}
        >
          <svg
            className="h-[18px] w-[18px]"
            style={{ color: 'var(--toast-accent)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">{message}</span>
          <span
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            Changes synced to your favorites
          </span>
        </div>
      </div>
    </div>
  )
}
