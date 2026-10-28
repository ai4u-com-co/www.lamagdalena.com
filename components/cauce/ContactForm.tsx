'use client'

import { useState } from 'react'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, SERVICE_OPTIONS } from './data'

type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMPTY = { name: '', email: '', service: '', message: '' }

export default function ContactForm() {
  const [data, setData] = useState(EMPTY)
  const [honey, setHoney] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (honey) return // bot
    setStatus('submitting')
    const id = process.env.NEXT_PUBLIC_FORMSPREE_ID
    if (!id) {
      setStatus('error')
      return
    }
    try {
      const res = await fetch(`https://formspree.io/f/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          servicio: data.service,
          message: data.message,
          origen: 'cauce-landing',
          _subject: 'Cauce · nuevo contacto desde la landing',
        }),
      })
      if (!res.ok) throw new Error('formspree')
      setData(EMPTY)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="cauce-form cauce-form--done" role="status">
        <h3>Recibimos tu mensaje.</h3>
        <p>Gracias por contarnos tu historia. Te escribimos en las próximas 48 horas con una primera lectura de tu marca.</p>
        <button type="button" className="cauce-btn cauce-btn--outline" onClick={() => setStatus('idle')}>
          Enviar otro mensaje
        </button>
      </div>
    )
  }

  const busy = status === 'submitting'

  return (
    <form className="cauce-form" onSubmit={onSubmit} noValidate={false}>
      <div className="cauce-field">
        <label htmlFor="cauce-name">Nombre</label>
        <input id="cauce-name" name="name" type="text" autoComplete="name" required placeholder="Tu nombre" value={data.name} onChange={onChange} disabled={busy} />
      </div>
      <div className="cauce-field">
        <label htmlFor="cauce-email">Correo</label>
        <input id="cauce-email" name="email" type="email" autoComplete="email" required placeholder="hola@tumarca.com" value={data.email} onChange={onChange} disabled={busy} />
      </div>
      <div className="cauce-field">
        <label htmlFor="cauce-service">¿En qué te ayudamos?</label>
        <select id="cauce-service" name="service" required value={data.service} onChange={onChange} disabled={busy}>
          <option value="" disabled>
            Elige un servicio…
          </option>
          {SERVICE_OPTIONS.map(o => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div className="cauce-field">
        <label htmlFor="cauce-message">Cuéntanos brevemente</label>
        <textarea id="cauce-message" name="message" rows={4} required placeholder="Qué quieres contar, a quién y para qué." value={data.message} onChange={onChange} disabled={busy} />
      </div>

      {/* Trampa para bots: invisible para personas */}
      <div className="cauce-sr" aria-hidden="true">
        <label htmlFor="cauce-web">No llenar este campo</label>
        <input id="cauce-web" type="text" tabIndex={-1} autoComplete="off" value={honey} onChange={e => setHoney(e.target.value)} />
      </div>

      <button type="submit" className="cauce-btn cauce-btn--orange cauce-btn--block" disabled={busy}>
        {busy ? 'Enviando…' : 'Enviar mensaje'}
      </button>

      <p className="cauce-form__error" role="alert" hidden={status !== 'error'}>
        No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos por Instagram:{' '}
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
          {INSTAGRAM_HANDLE}
        </a>
        .
      </p>
    </form>
  )
}
