import type { Metadata } from 'next'
import Link from 'next/link'
import SiteFooter from '@/components/organisms/SiteFooter'
import './jarupia.css'

export const metadata: Metadata = {
  title: 'Jarupia — El secreto de Ayapel | Chino Romero Hoyos',
  description:
    'Jarupia: El secreto de Ayapel. Un fotolibro ficcionado de Chino Romero Hoyos inspirado en la Ciénaga de Ayapel, donde la naturaleza tiene memoria y los territorios le hablan a quienes saben escuchar.',
}

/**
 * Landing de Jarupia dentro del sitio de La Magdalena: mismo diseño de siempre
 * (marcado y estilos portados sin cambios, aislados bajo .jr-landing / jr-*),
 * ahora con el menú del sitio, un "Volver" y el pie de La Magdalena.
 */
export default function JarupiaPage() {
  return (
    <main id="jarupia">
      <Link href="/" className="story-back-btn jr-back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Volver
      </Link>

      <div className="jr-landing">
        <section data-nav-theme="light" className="jr-hero" id="hero">
          <div className="jr-hero-text">
            <p className="jr-pretitle">Chino Romero Hoyos</p>
            <h1 className="jr-hero-title">Jarupia</h1>
            <p className="jr-hero-lead">Es un fotolibro ficcionado que está inspirado en la ciénaga de Ayapel, las historias de los pescadores y pobladores alimentaron los mundos posibles de sus aguas.</p>
            <div className="jr-hero-cta">
              <a
                href="https://wa.me/573042464962?text=Hola%2C%20quiero%20adquirir%20un%20ejemplar%20de%20Jarupia%3A%20El%20secreto%20de%20Ayapel."
                className="jr-btn jr-btn-fill"
                id="jr-cta-comprar"
                target="_blank"
                rel="noopener noreferrer"
              >Conseguir el libro</a>
              <a href="#historia" className="jr-btn jr-btn-ghost" id="jr-cta-historia">Explorar la historia</a>
            </div>
          </div>
          <div className="jr-hero-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/jarupia/assets/redesign/hero-book.webp" alt="Portada del libro Jarupia — El secreto de Ayapel" width="1095" height="1367" />
          </div>
        </section>
        <section data-nav-theme="light" className="jr-sinopsis" id="historia">
          <div className="jr-sinopsis-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/jarupia/assets/redesign/sinopsis-tree.webp" alt="La gran ceiba de la Jarupia" width="985" height="1227" loading="lazy" />
          </div>
          <div className="jr-sinopsis-text">
            <h2>Un accidente lo llevó al otro lado de la ciénaga</h2>
            <p>Alejo creció en las orillas de la Ciénaga de Ayapel, bajo la sombra de la gran ceiba donde su abuela Ofelina le contaba historias de ríos que hablan y bosques que caminan. Historias que él, con el tiempo, aprendió a no creer.</p>
            <p>Hasta el día en que un manatí llamado Obi lo arrastró a través de las puertas de otro mundo. Un lugar virgen, sin huella humana, donde el agua es transparente y los árboles llevan siglos transmitiendo lo que saben.</p>
            <p>En La Jarupia, Alejo conoce a Tyron —el Hombre Hicotea— que le advierte: la única forma de regresar a casa es que Cachime lo autorice. Y eso no pasa desde hace muchos años.</p>
            <blockquote>
              "Ustedes creen que saben muchas cosas, pero en realidad olvidaron lo más básico y sin eso no se puede entender nada."
              <cite>— Tyron, el Hombre Hicotea</cite>
            </blockquote>
          </div>
        </section>
        <section data-nav-theme="light" className="jr-galeria" id="galeria">
          <div className="jr-galeria-row jr-galeria-row-3">
            <div className="jr-galeria-item">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/jarupia/assets/redesign/gal-1.webp" alt="Página del libro Jarupia" loading="lazy" /></div>
            <div className="jr-galeria-item">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/jarupia/assets/redesign/gal-2.webp" alt="Tela azul sobre la ciénaga al atardecer" loading="lazy" /></div>
            <div className="jr-galeria-item">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/jarupia/assets/redesign/gal-3.webp" alt="Mano sosteniendo un fruto" loading="lazy" /></div>
          </div>
          <div className="jr-galeria-row jr-galeria-row-4">
            <div className="jr-galeria-item">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/jarupia/assets/redesign/gal-4.webp" alt="Mapa ilustrado de la Jarupia" loading="lazy" /></div>
            <div className="jr-galeria-item">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/jarupia/assets/redesign/gal-5.webp" alt="Vía láctea sobre la vegetación de la ciénaga" loading="lazy" /></div>
            <div className="jr-galeria-item">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/jarupia/assets/redesign/gal-6.webp" alt="Página del libro Jarupia con ramas" loading="lazy" /></div>
            <div className="jr-galeria-item">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/jarupia/assets/redesign/gal-7.webp" alt="Retrato con vestimenta tejida" loading="lazy" /></div>
          </div>
        </section>
        <section data-nav-theme="light" className="jr-autor" id="autor">
          <div className="jr-autor-text">
            <h2>El autor</h2>
            <p className="jr-pretitle">Chino Romero Hoyos</p>
            <p>Fotógrafo y creativo colombiano cuya obra recorre el país con el propósito de narrar historias que revelan la conexión entre el territorio y las personas.</p>
            <p>En sus viajes entendió que muchos colombianos desconocen su geografía física tanto como su geografía humana. Por eso, con su trabajo busca mostrar las múltiples identidades que se alejan de los paradigmas establecidos.</p>
            <p>Su práctica fotográfica integra la cotidianidad de quienes habitan los territorios, las tradiciones que persisten, las transformaciones en curso y la belleza de lo ambiental y lo cultural — tratando que las imágenes sean un puente de empatía y reconocimiento.</p>
            <a href="mailto:Chino@lamagdalena.com.co" className="jr-autor-link" id="jr-link-autor-email">Chino@lamagdalena.com.co</a>
          </div>
          <div className="jr-autor-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/jarupia/assets/redesign/autor-portrait.webp" alt="Retrato de Chino Romero Hoyos" width="1220" height="1536" loading="lazy" />
          </div>
        </section>
        
      </div>

      <SiteFooter />
    </main>
  )
}
