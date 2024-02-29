import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Delygg",
  description: "Download torrent from ygg directly to your deluge server",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`inter.className bg-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
