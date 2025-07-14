import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Connect Groups | C3 Toronto',
  description: 'Join a Connect Group at C3 Toronto. Find community, grow your faith, and connect with God through our small groups.',
  keywords: ['C3 Toronto', 'Connect Groups', 'Small Groups', 'Community', 'Faith', 'Church'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}