import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const geist = Inter({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'FitTracker',
  description: 'Suivez vos performances sportives',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${geist.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
