import type { Metadata } from "next"
import "./globals.css"

import { ThemeProvider } from "@/providers/theme-provider"
import { SessionProvider } from "next-auth/react"

export const metadata: Metadata = {
  title: "Editorial"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="w-full h-dvh">
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
