import type { Metadata } from 'next'
import PageTransition from './components/PageTransition/PageTransition'
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
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}

