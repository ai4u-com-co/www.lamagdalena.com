import type { Metadata } from 'next'
import '@/components/cauce/cauce.css'

const TITLE = 'Cauce · Estudio de storytelling by La Magdalena'
const DESCRIPTION =
  'Convertimos el impacto social, ambiental y cultural en activos de reputación y posicionamiento. Estrategia, creatividad e historias de impacto.'

export const metadata: Metadata = {
  metadataBase: new URL('https://lamagdalena.com.co'),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://lamagdalena.com.co/cauce' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://lamagdalena.com.co/cauce',
    siteName: 'Cauce · by La Magdalena',
    images: [{ url: '/cauce/og.png', width: 1200, height: 630, alt: 'Cauce, estudio by La Magdalena' }],
    locale: 'es_CO',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/cauce/og.png'] },
}

export default function CauceLayout({ children }: { children: React.ReactNode }) {
  return <div className="cauce">{children}</div>
}
