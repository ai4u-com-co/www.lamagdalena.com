'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import NavLinks from '@/components/molecules/NavLinks'
import { useScrolled } from './useScrolled'

interface NavBarProps {
  theme?: 'dark' | 'light'
}

const mainMenuItems = [
  { label: 'Inicio', path: '/', hash: '#inicio' },
  { label: 'Somos', path: '/somos', hash: '' },
  { label: 'Historias', path: '/historias', hash: '' },
  { label: 'Jarupia', path: '/jarupia', hash: '' },
  { label: 'Cauce', path: '/cauce', hash: '' },
  { label: 'Servicios', path: '/', hash: '#servicios' },
]

const footerMenuItems = [
  { label: 'Tienda', path: '/shop', hash: '' },
  { label: 'Contacto', path: '/', hash: '#contacto' },
]

export default function NavBar({ theme = 'dark' }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const scrolled = useScrolled()

  useEffect(() => {
    document.body.classList.toggle('body-locked', isMenuOpen)
    return () => document.body.classList.remove('body-locked')
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  const isActive = (path: string, hash = '') => {
    if (path === '/' && hash === '#inicio') return pathname === '/'
    if (hash) return pathname === path
    return pathname === path
  }

  const isDetailPage = ['/historias/', '/shop/', '/jarupia', '/portafolio'].some(
    p => pathname.includes(p) && pathname !== '/historias' && pathname !== '/shop'
  )

  // Sobre la barra con fondo (ya se bajó) las letras van siempre oscuras; arriba, según la sección.
  const themeClass = scrolled || theme === 'light' ? 'theme-light' : 'theme-dark'

  // Estando ya en "/", el Link no navega (misma URL): se sube con scroll suave (mismo ajuste que Nakoa).
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Barra fija: transparente arriba (con una franja oscura suave si hay foto detrás);
          al bajar toma fondo y el logo queda siempre a la vista. Patrón del navbar de Nakoa. */}
      <div
        className="site-header"
        data-scrolled={scrolled}
        data-over-dark={theme === 'dark'}
      >
        <div className="site-header__band" aria-hidden="true" />
        <div className="site-header__solid" aria-hidden="true" />
        <Link href="/" onClick={handleLogoClick} className="site-header__logo" aria-label="La Magdalena — Inicio">
          <span className="site-header__logo-mark" aria-hidden="true" />
        </Link>
      </div>

      <button
        className={`menu-toggle ${isDetailPage ? 'on-detail' : ''} ${themeClass}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        Menú
      </button>

      <a
        href="https://instagram.com/lamagdalena___"
        target="_blank"
        rel="noopener noreferrer"
        className={`instagram-link-static ${isDetailPage ? 'on-detail' : ''} ${themeClass}`}
        aria-label="Instagram"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </a>

      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}>
        <div className="menu-container" onClick={e => e.stopPropagation()}>
          <div className="menu-header">
            <button className="menu-close-text" onClick={closeMenu}>Cerrar</button>
          </div>

          <NavLinks
            items={mainMenuItems}
            onItemClick={closeMenu}
            activeChecker={isActive}
            className="overlay-nav"
            itemClassName="menu-link"
          />

          <div className="menu-footer">
            {footerMenuItems.map(item => (
              <Link
                key={item.path + item.hash}
                href={item.path + item.hash}
                onClick={closeMenu}
                className={`footer-link ${isActive(item.path, item.hash) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
            <a href="https://instagram.com/lamagdalena___" target="_blank" rel="noopener noreferrer" className="footer-link">Síguenos</a>
          </div>
        </div>
      </div>
    </>
  )
}
