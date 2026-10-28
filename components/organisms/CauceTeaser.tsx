import Link from 'next/link'

/**
 * Puerta de entrada a /cauce desde la home de La Magdalena.
 * Cauce es el estudio de La Magdalena para organizaciones; usa su propia paleta
 * (verde/menta/naranja), por eso la sección se lee como una marca hermana.
 */
export default function CauceTeaser() {
  return (
    <section id="cauce" className="cauce-teaser" aria-labelledby="cauce-teaser-title">
      <div className="container cauce-teaser__inner">
        <div className="cauce-teaser__brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cauce/cauce-menta.svg" alt="Cauce, estudio by La Magdalena" width={440} height={88} />
        </div>
        <div className="cauce-teaser__copy">
          <p className="cauce-teaser__kicker">Para organizaciones y marcas</p>
          <h2 id="cauce-teaser-title">Cauce: convertimos impacto en reputación.</h2>
          <p>
            Llevamos nuestra forma de contar a las empresas. Estrategia, creatividad e historias de impacto para que lo
            que una organización hace se entienda, se recuerde y genere valor.
          </p>
          <Link href="/cauce" className="cauce-teaser__cta">
            Conocer Cauce <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
