import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ClientProviders } from '@/components/providers/client-providers'
import { LocationProvider } from "@/contexts/location-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nuvigo - Assistente Meteorológico",
  description: "Seu assistente meteorológico pessoal",
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
          <LocationProvider>
            {children}
          </LocationProvider>
        </ClientProviders>
      </body>
    </html>
  )
}

