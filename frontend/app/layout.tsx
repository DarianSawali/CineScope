import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'CineScope',
  description: 'A Movie Directory App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative overflow-x-hidden text-gray-900 font-sans min-h-screen flex flex-col">
        <div className="fixed top-0 left-0 w-screen h-screen z-[-1] bg-gradient-to-b from-[#181225] to-[#2c1c2e]" />
        <div className="sticky top-0 z-50">
          <Header />
        </div>
        <main className="flex-1 z-10 px-4">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  )
}
