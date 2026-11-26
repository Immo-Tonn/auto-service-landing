'use client'
// src/components/ui/SuccessDialog.tsx
// Shared confirmation after a successful form submit. Click anywhere closes it.

import Dialog from './Dialog'

interface Props {
  open: boolean
  onClose: () => void
  message: string
  confirmation?: string
  clickToClose: string
}

export default function SuccessDialog({ open, onClose, message, confirmation, clickToClose }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      ariaLabel={message}
      backdropClassName="bg-black/60"
      panelClassName="relative bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl px-10 py-10 text-center max-w-sm w-full cursor-pointer"
      closeClassName="absolute top-3 right-4 text-slate-500 hover:text-yellow-400 text-2xl leading-none transition-colors duration-200"
    >
      <div onClick={onClose}>
        <div className="text-5xl mb-4" aria-hidden="true">✅</div>
        <p className="text-slate-100 text-base font-semibold">{message}</p>
        {confirmation && <p className="text-slate-300 text-sm mt-2">{confirmation}</p>}
        <p className="text-xs text-slate-400 mt-4">{clickToClose}</p>
      </div>
    </Dialog>
  )
}
