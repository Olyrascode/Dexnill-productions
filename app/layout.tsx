import type { Metadata } from 'next'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Portfolio Photographie',
  description: 'Portfolio créatif de photographie',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}

