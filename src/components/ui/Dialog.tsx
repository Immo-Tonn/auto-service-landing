'use client'
// src/components/ui/Dialog.tsx
//
// Modal shell on the native <dialog> element (Baseline Widely Available).
// The browser provides: focus trap, Escape to close, focus return to the
// opener, inert background and top-layer stacking (no z-index wars).
// Framer Motion only animates the backdrop and the panel; the <dialog> stays
// open until the exit animation has finished.

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface DialogProps {
  open: boolean
  onClose: () => void
  /** Visible heading; also used as the accessible name. */
  title?: string
  /** Accessible name when there is no visible title. */
  ariaLabel?: string
  children: ReactNode
  /** Classes of the animated content panel. */
  panelClassName?: string
  /** Classes of the backdrop layer. */
  backdropClassName?: string
  /** Classes of the built-in close button. */
  closeClassName?: string
  closeLabel?: string
  onKeyDown?: (e: KeyboardEvent<HTMLDialogElement>) => void
}

const DEFAULT_PANEL =
  'relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-8'
const DEFAULT_CLOSE =
  'absolute top-4 right-4 text-slate-500 hover:text-yellow-400 text-2xl leading-none transition-colors duration-200'

export default function Dialog({
  open,
  onClose,
  title,
  ariaLabel,
  children,
  panelClassName = DEFAULT_PANEL,
  backdropClassName = 'bg-black/70 backdrop-blur-sm',
  closeClassName = DEFAULT_CLOSE,
  closeLabel = 'Schließen', // TODO(i18n, block 7)
  onKeyDown,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  // Keep the <dialog> in the DOM while the exit animation runs.
  const [mounted, setMounted] = useState(open)
  if (open && !mounted) setMounted(true)

  useEffect(() => {
    const dialog = ref.current
    if (open && dialog && !dialog.open) dialog.showModal()
  }, [open, mounted])

  if (!mounted) return null

  return (
    <dialog
      ref={ref}
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : ariaLabel}
      // Escape: let the exit animation play instead of closing instantly
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      // Closed by the browser anyway (e.g. repeated Escape)
      onClose={() => {
        if (open) onClose()
      }}
      onKeyDown={onKeyDown}
      className="
        fixed inset-0 m-0 size-full max-h-none max-w-none
        bg-transparent p-4 overflow-y-auto overscroll-contain
        open:flex flex-col
        backdrop:bg-transparent
      "
    >
      <AnimatePresence
        onExitComplete={() => {
          ref.current?.close()
          setMounted(false)
        }}
      >
        {open && (
          <motion.div
            key="backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 ${backdropClassName}`}
            onClick={onClose}
          />
        )}
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25 }}
            className={`m-auto ${panelClassName}`}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className={closeClassName}
            >
              <span aria-hidden="true">×</span>
            </button>

            {title && (
              <h2 id={titleId} className="text-xl font-bold text-slate-100 mb-6 pr-8">
                {title}
              </h2>
            )}

            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  )
}
