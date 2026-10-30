'use client'

import { useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import NavBar from '@/components/organisms/NavBar'
import SiteFooter from '@/components/organisms/SiteFooter'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [navTheme, setNavTheme] = useState<'dark' | 'light'>('dark')
  const pathname = usePathname()
  // /portafolio es un visor de PDF a pantalla completa fija: el pie quedaría oculto detrás.
  const showFooter = !pathname.startsWith('/portafolio')

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -90% 0px',
      threshold: 0,
    }

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target
          const isLight =
            section.classList.contains('blog-section') ||
            section.classList.contains('contact-main-section') ||
            section.classList.contains('historias-page') ||
            section.classList.contains('jarupia-page') ||
            section.getAttribute('data-nav-theme') === 'light'
          setNavTheme(isLight ? 'light' : 'dark')
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)
    document.querySelectorAll('section, main > div, footer[data-nav-theme]').forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="main-layout">
      <header>
        <NavBar theme={navTheme} />
      </header>
      {children}
      {showFooter && <SiteFooter />}
    </div>
  )
}
