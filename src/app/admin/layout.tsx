'use client'

import { SessionProvider } from 'next-auth/react'
import '../globals.css'
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}