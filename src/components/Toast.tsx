'use client'

import { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const isError = type === 'error'

  return (
    <div
      className="fixed top-6 left-1/2 z-50 -translate-x-1/2 animate-slide-up"
      role="status"
      aria-live="polite"
    >
      <div
        className="flex items-center rounded-md"
        style={{
          gap: '0.75rem',
          padding: '10px',
          background: 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(2,6,23,0.85))',
          color: 'var(--toast-fg)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 35px rgba(2,6,23,0.65)'
        }}
      >
        <div
          className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full"
          style={{
            background: isError ? 'rgba(251, 113, 133, 0.18)' : 'rgba(34, 197, 94, 0.18)',
            border: isError ? '1px solid rgba(251,113,133,0.35)' : '1px solid rgba(34,197,94,0.35)'
          }}
        >
          <svg
            className="h-[18px] w-[18px]"
            style={{ color: isError ? 'var(--danger)' : 'var(--toast-accent)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            {isError ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            )}
          </svg>
        </div>
        <span className="text-sm font-semibold tracking-tight">{message}</span>
      </div>
    </div>
  )
}
