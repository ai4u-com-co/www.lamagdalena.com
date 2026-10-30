import Link from 'next/link'
import './site-footer.css'

const explore = [
  { label: 'Inicio', href: '/' },
  { label: 'Somos', href: '/somos' },
  { label: 'Historias', href: '/historias' },
  { label: 'Jarupia', href: '/jarupia' },
  { label: 'Cauce', href: '/cauce' },
  { label: 'Tienda', href: '/shop' },
] as const

/** Pie del sitio de La Magdalena. Es el lugar del contacto (el menú enlaza a #contacto). */
export default function SiteFooter() {
  return (
    <footer id="contacto" className="site-footer" data-nav-theme="light">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__name">La Magdalena</p>
          <p className="site-footer__tag">Comunicación para el impacto real.</p>
        </div>

        <nav className="site-footer__col" aria-label="Explora el sitio">
          <p className="site-footer__title">Explora</p>
          {explore.map(l => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="site-footer__col">
          <p className="site-footer__title">Contacto</p>
          <a href="mailto:chino@lamagdalena.com.co">chino@lamagdalena.com.co</a>
          <a href="tel:+573042644962">+57 304 264 4962</a>
          <a href="https://www.instagram.com/lamagdalena___" target="_blank" rel="noopener noreferrer">
            Instagram @lamagdalena___
          </a>
        </div>
      </div>

      <div className="site-footer__legal">
        <p>© 2026 La Magdalena</p>
        <Link href="/">← Volver al inicio</Link>
      </div>
    </footer>
  )
}
