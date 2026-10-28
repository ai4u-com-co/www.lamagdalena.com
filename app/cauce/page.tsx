import Image from 'next/image'
import Link from 'next/link'
import CauceNav from '@/components/cauce/CauceNav'
import ContactForm from '@/components/cauce/ContactForm'
import { CASOS, CLIENTES, GOLDEN_CIRCLE, INSTAGRAM_HANDLE, INSTAGRAM_URL, METHOD, PROOF, SERVICES, SITE_LINKS } from '@/components/cauce/data'

export default function CaucePage() {
  return (
    <>
      <a href="#contenido" className="cauce-skip">
        Saltar al contenido
      </a>
      <CauceNav />

      <main id="contenido">
        {/* ───────── Hero ───────── */}
        <section id="top" className="cauce-hero">
          <div className="cauce-container cauce-hero__grid">
            <div className="cauce-hero__copy">
              <p className="cauce-kicker">Estudio de storytelling · by La Magdalena</p>
              <h1 className="cauce-hero__title">
                Convertimos impacto en <span>reputación.</span>
              </h1>
              <p className="cauce-lead">
                Convertimos el impacto social, ambiental y cultural de tu organización en activos de reputación y
                posicionamiento: historias que la gente entiende, recuerda y quiere compartir.
              </p>
              <div className="cauce-hero__cta">
                <a href="#contacto" className="cauce-btn cauce-btn--orange">
                  Empecemos
                </a>
                <a href="#casos" className="cauce-btn cauce-btn--outline">
                  Ver casos <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <div className="cauce-hero__art" aria-hidden="true">
              <div className="cauce-hero__img cauce-hero__img--a">
                <Image src="/cauce/casos/loto-del-sur.webp" alt="" fill sizes="(min-width: 1024px) 22rem, 0px" />
              </div>
              <div className="cauce-hero__img cauce-hero__img--b">
                <Image src="/cauce/casos/puntos-colombia.webp" alt="" fill sizes="(min-width: 1024px) 16rem, 0px" />
              </div>
            </div>
          </div>

          <div className="cauce-container">
            <dl className="cauce-proof">
              {PROOF.map(p => (
                <div key={p.value} className="cauce-proof__item">
                  <dt>{p.value}</dt>
                  <dd>{p.label}</dd>
                </div>
              ))}
            </dl>
            <p className="cauce-proof__source">Café Diverso · Bancolombia</p>
          </div>
        </section>

        {/* ───────── Manifiesto ───────── */}
        <section className="cauce-band" aria-label="Lema del estudio">
          <div className="cauce-container">
            <p className="cauce-band__text">Mostrame el norte, que yo hago camino.</p>
            <p className="cauce-band__sub">Historias que inspiran cambios</p>
          </div>
        </section>

        {/* ───────── Quiénes somos ───────── */}
        <section id="estudio" className="cauce-section">
          <div className="cauce-container cauce-about">
            <div>
              <p className="cauce-kicker">Quiénes somos</p>
              <h2 className="cauce-h2">Somos Cauce.</h2>
              <p className="cauce-body cauce-body--big">
                Un estudio de estrategia, creatividad e historias de impacto. Ayudamos a organizaciones a definir su
                relato corporativo y a convertirlo en un activo estratégico que se comunica, se recuerda y genera valor
                de negocio.
              </p>
            </div>
            <aside className="cauce-panel">
              <p className="cauce-panel__label">Propuesta de valor</p>
              <p>
                Ayudamos a las áreas de sostenibilidad y mercadeo a convertir sus iniciativas sociales, ambientales y
                culturales en activos de reputación y posicionamiento frente a inversionistas, aliados estratégicos y
                clientes corporativos.
              </p>
              <p>
                A través de una metodología de investigación, inmersión e identificación de oportunidades que conectan
                propósito, impacto y negocio.
              </p>
            </aside>
          </div>
        </section>

        {/* ───────── Servicios ───────── */}
        <section id="servicios" className="cauce-section cauce-section--tight">
          <div className="cauce-container">
            <p className="cauce-kicker">Servicios</p>
            <h2 className="cauce-h2">Comunicación con propósito, de punta a punta.</h2>
            <ol className="cauce-services">
              {SERVICES.map((s, i) => (
                <li key={s.id} className="cauce-service">
                  <span className="cauce-service__n">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── Método ───────── */}
        <section id="metodo" className="cauce-section cauce-section--green">
          <div className="cauce-container">
            <p className="cauce-kicker">Cómo pensamos</p>
            <h2 className="cauce-h2">El círculo de oro.</h2>
            <p className="cauce-body cauce-body--lead">
              La gente no compra lo que haces, compra por qué lo haces. Construimos de adentro hacia afuera.
            </p>

            <ol className="cauce-circle">
              {GOLDEN_CIRCLE.map(g => (
                <li key={g.key} className={`cauce-circle__row cauce-circle__row--${g.key}`}>
                  <span className="cauce-circle__n" aria-hidden="true">
                    {g.n}
                  </span>
                  <h3>{g.title}</h3>
                  <p>{g.text}</p>
                </li>
              ))}
            </ol>

            <h3 className="cauce-h3">Cómo lo hacemos</h3>
            <p className="cauce-body cauce-body--lead">
              Una metodología rigurosa que integra investigación estratégica, cocreación con los equipos y storytelling
              corporativo.
            </p>
            <ol className="cauce-method">
              {METHOD.map(m => (
                <li key={m.n}>
                  <span className="cauce-method__n">{m.n}</span>
                  <h4>{m.title}</h4>
                  <p>{m.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── Casos ───────── */}
        <section id="casos" className="cauce-section">
          <div className="cauce-container">
            <p className="cauce-kicker">Casos</p>
            <h2 className="cauce-h2">Historias que movieron la aguja.</h2>
            <ul className="cauce-cases">
              {CASOS.map(c => (
                <li key={c.slug} className="cauce-case">
                  <div className="cauce-case__media">
                    <Image src={c.imagen} alt={c.alt} fill sizes="(min-width: 1280px) 26rem, (min-width: 768px) 45vw, 100vw" />
                  </div>
                  <div className="cauce-case__body">
                    <p className="cauce-case__client">{c.cliente}</p>
                    <h3>{c.titulo}</h3>
                    <p className="cauce-case__type">{c.tipo}</p>
                    <details>
                      <summary>Ver el caso</summary>
                      <div className="cauce-case__detail">
                        <h4>El reto</h4>
                        <p>{c.reto}</p>
                        <h4>La solución</h4>
                        <p>{c.solucion}</p>
                        <h4>{c.listaTitulo}</h4>
                        <ul>
                          {c.lista.map(item => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────── Clientes ───────── */}
        <section id="clientes" className="cauce-section cauce-section--sand">
          <div className="cauce-container">
            <p className="cauce-kicker">Clientes y aliados</p>
            <h2 className="cauce-h2">Han confiado en nosotros.</h2>
            <ul className="cauce-clients">
              {CLIENTES.map(c => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────── Contacto ───────── */}
        <section id="contacto" className="cauce-section cauce-section--green cauce-contact">
          <div className="cauce-container cauce-contact__grid">
            <div>
              <p className="cauce-kicker">Hablemos</p>
              <h2 className="cauce-h2">Cuéntanos tu historia.</h2>
              <p className="cauce-body cauce-body--lead">
                Escríbenos y en 48 horas te devolvemos una primera lectura de tu marca, sin compromiso.
              </p>
              <p className="cauce-contact__ig">
                También en Instagram:{' '}
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  {INSTAGRAM_HANDLE}
                </a>
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      {/* ───────── Pie ───────── */}
      <footer className="cauce-footer">
        <div className="cauce-container cauce-footer__grid">
          <div className="cauce-footer__brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cauce/cauce-menta.svg" alt="Cauce, estudio by La Magdalena" width={220} height={44} />
            <p>Estudio de storytelling que convierte impacto en reputación.</p>
          </div>
          <nav aria-label="Estudio">
            <p className="cauce-footer__title">Estudio</p>
            <a href="#servicios">Servicios</a>
            <a href="#metodo">Método</a>
            <a href="#casos">Casos</a>
          </nav>
          <nav aria-label="Contacto">
            <p className="cauce-footer__title">Contacto</p>
            <a href="#contacto">Escríbenos</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              {INSTAGRAM_HANDLE}
            </a>
          </nav>
          <nav aria-label="La Magdalena">
            <p className="cauce-footer__title">La Magdalena</p>
            <Link href="/">← Volver al sitio</Link>
            {SITE_LINKS.map(l => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="cauce-container cauce-footer__legal">
          <p>© 2026 Cauce · by La Magdalena</p>
          <p>Propósito · Impacto · Negocio</p>
        </div>
      </footer>
    </>
  )
}
