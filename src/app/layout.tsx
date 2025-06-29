import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aimee - Your AI Best Friend',
  description: 'The first AI companion that genuinely feels like a real friend. Text anytime, share anything, and build a meaningful relationship.',
  keywords: 'AI friend, AI companion, AI chatbot, virtual friend, SMS AI, text AI, artificial intelligence',
  authors: [{ name: 'Aimee AI' }],
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  themeColor: '#9333ea',
  openGraph: {
    title: 'Aimee - Your AI Best Friend',
    description: 'The first AI companion that genuinely feels like a real friend. Text anytime, share anything, and build a meaningful relationship.',
    type: 'website',
    url: 'https://aimee-ai.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Aimee - Your AI Best Friend',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aimee - Your AI Best Friend',
    description: 'The first AI companion that genuinely feels like a real friend.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              color: '#374151',
            },
            className: 'toast',
            duration: 4000,
          }}
        />
      </body>
    </html>
  )
} 