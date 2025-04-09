import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ClientProviders } from '@/components/providers/ClientProviders'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Nuvigo - AI Weather Assistant",
  description: "Get weather insights with a conversational AI assistant",
  icons: {
    icon: "/android-chrome-192x192.png",
    shortcut: "/android-chrome-192x192.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}

