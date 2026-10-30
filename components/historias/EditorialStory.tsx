'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Story, StoryBlock } from '@/data/stories'
import './editorial-story.css'

/**
 * Página de una historia en formato editorial (referente: nota larga tipo Atmos):
 * foto de apertura a sangre, encabezado centrado, una columna de texto angosta y
 * fotos más anchas que el texto: solas, o en carrusel cuando hay varias seguidas.
 *
 * Los textos de `image-text` más cortos que CAPTION_MAX son pies de foto
 * ("La tronera, Peñón - Santander"), no párrafos.
 */
const CAPTION_MAX = 100

type Photo = { url: string; caption?: string }

type Item =
  | { kind: 'text'; paragraphs: string[] }
  | { kind: 'photo'; photo: Photo }
  | { kind: 'carousel'; photos: Photo[]; caption?: string }
  | { kind: 'quote'; text: string; author?: string }

const norm = (s: string) => s.replace(/\s+/g, ' ').trim()

function buildItems(content: StoryBlock[], lead: string): Item[] {
  const items: Item[] = []
  let run: Photo[] = []

  // Varias fotos sueltas seguidas se agrupan en un carrusel; una sola va a lo ancho.
  const flush = () => {
    if (!run.length) return
    items.push(run.length === 1 ? { kind: 'photo', photo: run[0] } : { kind: 'carousel', photos: run })
    run = []
  }

  const pushText = (text?: string) => {
    const paragraphs = (text ?? '')
      .split('\n')
      .map(norm)
      .filter(p => p && p !== norm(lead))
    if (paragraphs.length) items.push({ kind: 'text', paragraphs })
  }

  for (const b of content) {
    switch (b.type) {
      case 'image-container':
        if (b.image) {
          if (b.caption) {
            flush()
            items.push({ kind: 'photo', photo: { url: b.image, caption: b.caption } })
          } else run.push({ url: b.image })
        }
        break
      case 'image-text': {
        flush()
        const text = norm(b.text ?? '')
        const isCaption = text.length > 0 && text.length <= CAPTION_MAX && !b.title
        if (b.image) items.push({ kind: 'photo', photo: { url: b.image, caption: b.caption ?? (isCaption ? text : undefined) } })
        if (!isCaption) pushText(b.text)
        break
      }
      case 'image-duo':
        flush()
        if (b.imageLeft && b.imageRight) items.push({ kind: 'carousel', photos: [{ url: b.imageLeft }, { url: b.imageRight }], caption: b.caption })
        break
      case 'text':
        flush()
        pushText(b.text)
        break
      case 'quote':
        flush()
        if (b.text) items.push({ kind: 'quote', text: b.text, author: b.author })
        break
      default:
        break // hero, metadata y tags se muestran fuera del cuerpo
    }
  }
  flush()
  return items
}

/** Negritas y cursivas simples (**x** y *x*), como en el resto de las historias. */
function inline(text: string) {
  return text.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>
    return part
  })
}

/**
 * Carrusel horizontal (scroll-snap) para varias fotos seguidas: todas a la misma
 * altura, sin recortar ninguna; la siguiente asoma para invitar a deslizar.
 * Con flechas y contador; también se desliza con el dedo y con las flechas del teclado.
 */
function Carousel({ photos, alt, onOpen }: { photos: Photo[]; alt: string; onOpen: (url: string) => void }) {
  const scroller = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [edge, setEdge] = useState({ start: true, end: false })

  const sync = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const slides = Array.from(el.children) as HTMLElement[]
    const first = slides.findIndex(sl => sl.offsetLeft + sl.offsetWidth / 2 > el.scrollLeft + 1)
    setIndex(Math.max(0, first))
    setEdge({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 })
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [sync])

  const go = (dir: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    const slides = Array.from(el.children) as HTMLElement[]
    const target = slides[Math.min(slides.length - 1, Math.max(0, index + dir))]
    el.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
  }

  return (
    <div className="story-ed__carousel">
      <div
        ref={scroller}
        className="story-ed__track"
        role="region"
        aria-roledescription="carrusel"
        aria-label={`Fotos de la historia (${photos.length})`}
        tabIndex={0}
        onScroll={sync}
      >
        {photos.map(p => (
          <div key={p.url} className="story-ed__slide">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt={p.caption ?? alt} loading="lazy" decoding="async" onClick={() => onOpen(p.url)} />
          </div>
        ))}
      </div>
      <div className="story-ed__carousel-ctrl">
        <button type="button" onClick={() => go(-1)} disabled={edge.start} aria-label="Foto anterior">
          ‹
        </button>
        <button type="button" onClick={() => go(1)} disabled={edge.end} aria-label="Foto siguiente">
          ›
        </button>
        <span aria-live="polite">
          {Math.min(index + 1, photos.length)} / {photos.length}
        </span>
      </div>
    </div>
  )
}

export default function EditorialStory({ story }: { story: Story }) {
  const hero = story.content.find(b => b.type === 'hero')
  const lead = hero?.subtitle ?? ''
  const items = useMemo(() => buildItems(story.content, lead), [story.content, lead])
  const tags = story.content.find(b => b.type === 'tags')?.tags ?? story.tags

  const gallery = useMemo<Photo[]>(() => {
    const list: Photo[] = hero?.image ? [{ url: hero.image }] : []
    for (const it of items) {
      if (it.kind === 'photo') list.push(it.photo)
      if (it.kind === 'carousel') list.push(...it.photos)
    }
    return list
  }, [items, hero?.image])

  const [open, setOpen] = useState<number | null>(null)
  const openUrl = (url: string) => {
    const i = gallery.findIndex(p => p.url === url)
    if (i !== -1) setOpen(i)
  }
  const step = useCallback((d: number) => setOpen(i => (i === null ? null : (i + d + gallery.length) % gallery.length)), [gallery.length])

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, step])

  const Img = ({ photo, alt }: { photo: Photo; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photo.url} alt={photo.caption ?? alt} loading="lazy" decoding="async" onClick={() => openUrl(photo.url)} />
  )

  return (
    <article className="story-ed">
      {hero?.image && (
        <div className="story-ed__hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero.image} alt={story.title} onClick={() => openUrl(hero.image!)} />
        </div>
      )}

      <header className="story-ed__header">
        <p className="story-ed__category">{story.category}</p>
        <h1 className="story-ed__title">{story.title}</h1>
        <p className="story-ed__meta">
          <span>{story.date}</span>
          <span>Por {story.author}</span>
        </p>
        {story.location && <p className="story-ed__place">{story.location}</p>}
        {lead && <p className="story-ed__lead">{lead}</p>}
      </header>

      <div className="story-ed__body">
        {items.map((it, i) => {
          switch (it.kind) {
            case 'text':
              return (
                <div key={i} className="story-ed__col">
                  {it.paragraphs.map((p, j) => (
                    <p key={j}>{inline(p)}</p>
                  ))}
                </div>
              )
            case 'photo':
              return (
                <figure key={i} className="story-ed__figure">
                  <Img photo={it.photo} alt={story.title} />
                  {it.photo.caption && <figcaption>{it.photo.caption}</figcaption>}
                </figure>
              )
            case 'carousel':
              return (
                <figure key={i} className="story-ed__figure">
                  <Carousel photos={it.photos} alt={story.title} onOpen={openUrl} />
                  {it.caption && <figcaption>{it.caption}</figcaption>}
                </figure>
              )
            case 'quote':
              return (
                <blockquote key={i} className="story-ed__quote">
                  <p>“{inline(it.text)}”</p>
                  {it.author && <cite>— {it.author}</cite>}
                </blockquote>
              )
          }
        })}

        {tags.length > 0 && (
          <ul className="story-ed__tags" aria-label="Etiquetas">
            {tags.map(t => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </div>

      {open !== null && (
        <div className="lightbox-overlay" role="dialog" aria-modal="true" aria-label="Galería de fotos" onClick={() => setOpen(null)}>
          <button className="lightbox-close" onClick={() => setOpen(null)} aria-label="Cerrar">×</button>
          <button className="lightbox-nav prev" onClick={e => { e.stopPropagation(); step(-1) }} aria-label="Foto anterior">‹</button>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gallery[open].url} alt={gallery[open].caption ?? story.title} />
            {gallery[open].caption && <p className="lightbox-caption">{gallery[open].caption}</p>}
            <span className="lightbox-counter">{open + 1} / {gallery.length}</span>
          </div>
          <button className="lightbox-nav next" onClick={e => { e.stopPropagation(); step(1) }} aria-label="Foto siguiente">›</button>
        </div>
      )}
    </article>
  )
}
