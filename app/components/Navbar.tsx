// src/components/ui/Navbar.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: '/', label: 'Главная' },
    { href: '/recipes', label: 'Рецепты' },
    { href: '/recipes/new', label: '+ Добавить' },
    { href: '/meal-plan', label: 'План питания' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-earth-800 text-cream-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="font-display text-xl font-bold tracking-wide text-cream-200 hover:text-cream-50 transition-colors">
          КулинАрт
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === link.href
                  ? 'bg-spice-500 text-white'
                  : 'text-cream-200 hover:text-white hover:bg-earth-700'
              } ${link.label.startsWith('+') ? 'border border-cream-400/30' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-cream-200 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-earth-900 border-t border-earth-700 px-6 py-4 flex flex-col gap-2">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === link.href
                  ? 'bg-spice-500 text-white'
                  : 'text-cream-200 hover:text-white hover:bg-earth-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
