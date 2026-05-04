// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/ui/Navbar'

export const metadata: Metadata = {
  title: 'КулинАрт — Рецепты с любовью',
  description: 'Коллекция рецептов с планировщиком питания',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-cream-50">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <footer className="bg-earth-800 text-cream-100 py-10 mt-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="font-display text-xl mb-2">КулинАрт</p>
            <p className="text-sm text-cream-300 opacity-70">Готовьте с удовольствием ✨</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
