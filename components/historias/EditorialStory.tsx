'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Story, StoryBlock } from '@/data/stories'
import './editorial-story.css'

/**
 * Página de una historia en formato editorial (referente: nota larga tipo Atmos):
 * foto de apertura a sangre, encabezado centrado, una columna de texto angosta y
 * fotos más anchas que el texto, solas o en parejas, con pie de foto.
 *
 * Los textos de `image-text` más cortos que CAPTION_MAX son pies de foto
 * ("La tronera, Peñón - Santander"), no párrafos.
 */
const CAPTION_MAX = 100

type Photo = { url: string; caption?: string }

type Item =
  | { kind: 'text'; paragraphs: string[] }
  | { kind: 'photo'; photo: Photo }
  | { kind: 'pair'; photos: [Photo, Photo]; caption?: string }
  | { kind: 'quote'; text: string; author?: string }

const norm = (s: string) => s.replace(/\s+/g, ' ').trim()

function buildItems(content: StoryBlock[], lead: string): Item[] {
  const items: Item[] = []
  let run: Photo[] = []

  // Fotos sueltas consecutivas: si son impares, la primera va sola y el resto en parejas.
  const flush = () => {
    if (!run.length) return
    let rest = run
    if (run.length % 2 === 1) {
      items.push({ kind: 'photo', photo: run[0] })
      rest = run.slice(1)
    }
    for (let i = 0; i < rest.length; i += 2) items.push({ kind: 'pair', photos: [rest[i], rest[i + 1]] })
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
        if (b.imageLeft && b.imageRight) items.push({ kind: 'pair', photos: [{ url: b.imageLeft }, { url: b.imageRight }], caption: b.caption })
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

export default function EditorialStory({ story }: { story: Story }) {
  const hero = story.content.find(b => b.type === 'hero')
  const lead = hero?.subtitle ?? ''
  const items = useMemo(() => buildItems(story.content, lead), [story.content, lead])
  const tags = story.content.find(b => b.type === 'tags')?.tags ?? story.tags

  const gallery = useMemo<Photo[]>(() => {
    const list: Photo[] = hero?.image ? [{ url: hero.image }] : []
    for (const it of items) {
      if (it.kind === 'photo') list.push(it.photo)
      if (it.kind === 'pair') list.push(...it.photos)
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
            case 'pair':
              return (
                <figure key={i} className="story-ed__figure story-ed__pair">
                  <div className="story-ed__pair-grid">
                    <Img photo={it.photos[0]} alt={story.title} />
                    <Img photo={it.photos[1]} alt={story.title} />
                  </div>
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
