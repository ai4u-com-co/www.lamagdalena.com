'use client'

import { useEffect, useState } from 'react'
import { NAV_LINKS } from './data'

export default function CauceNav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className="cauce-nav">
      <div className="cauce-nav__bar cauce-container">
        <a href="#top" className="cauce-nav__logo" onClick={close} aria-label="Cauce, estudio by La Magdalena. Ir al inicio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cauce/cauce-naranja.svg" alt="" width={220} height={44} />
        </a>

        <nav className="cauce-nav__links" aria-label="Principal">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="cauce-nav__actions">
          <a href="#contacto" className="cauce-btn cauce-btn--sm cauce-btn--orange" onClick={close}>
            Hablemos
          </a>
          <button
            type="button"
            className="cauce-nav__toggle"
            aria-expanded={open}
            aria-controls="cauce-menu"
            onClick={() => setOpen(o => !o)}
          >
            <span className="cauce-sr">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
            <span className="cauce-nav__burger" aria-hidden="true" data-open={open} />
          </button>
        </div>
      </div>

      <nav id="cauce-menu" className="cauce-nav__menu" aria-label="Menú móvil" hidden={!open}>
        <div className="cauce-container">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={close}>
              {l.label}
            </a>
          ))}
          <a href="#clientes" onClick={close}>
            Clientes
          </a>
        </div>
      </nav>
    </header>
  )
}
