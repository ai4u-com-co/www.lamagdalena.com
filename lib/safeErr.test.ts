import { describe, expect, it } from 'vitest'
import { safeErr } from './safeErr'

const EMAIL = 'ana.perez+x@cliente-ejemplo.com'
const LEAKS = [EMAIL, 'cliente-ejemplo.com', 'abc123secret', 'ana.perez']

function dirty(): Error {
  const e = new Error(`550 Recipient address rejected: ${EMAIL} via https://api.test/x?token=abc123secret&a=1`)
  e.name = 'SmtpError'
  e.stack = `SmtpError: 550 Recipient ${EMAIL}\n    at send (https://api.test/x?access_token=abc123secret)`
  ;(e as unknown as { cause: unknown }).cause = new Error(EMAIL)
  ;(e as unknown as { config: unknown }).config = { auth: { pass: 'abc123secret' } }
  return e
}

describe('safeErr', () => {
  it('conserva el name y quita correos y secretos de message y stack', () => {
    const out = safeErr(dirty())
    expect(out).toBeInstanceOf(Error)
    expect(out.name).toBe('SmtpError')
    const dump = `${out.message}\n${out.stack}`
    for (const leak of LEAKS) expect(dump).not.toContain(leak)
    expect(out.message).toContain('[correo]')
    expect(out.message).toContain('Recipient address rejected')
  })
  it('sin cause, config ni propiedades extra', () => {
    const out = safeErr(dirty()) as unknown as Record<string, unknown>
    expect('cause' in out).toBe(false)
    expect('config' in out).toBe(false)
    expect(Object.keys(out)).toEqual([])
  })
  it('enmascara Bearer, Basic, JWT y parámetros key/token/signature', () => {
    const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.c2lnbmF0dXJl'
    const out = safeErr(new Error(`Authorization: Bearer abc.def-123 | Basic dXNlcjpwYXNz | ${jwt} | ?key=K1&signature=S1&token=T1`))
    for (const leak of ['abc.def-123', 'dXNlcjpwYXNz', jwt, 'K1', 'S1', 'T1']) expect(out.message).not.toContain(leak)
  })
  it('trunca message a 500 y stack a 1500', () => {
    const e = new Error('m'.repeat(5000))
    e.stack = 's'.repeat(9000)
    const out = safeErr(e)
    expect(out.message.length).toBeLessThanOrEqual(500)
    expect(out.stack!.length).toBeLessThanOrEqual(1500)
  })
  it('acepta valores que no son Error (string, objeto con message, null)', () => {
    expect(safeErr(`falló ${EMAIL}`).message).not.toContain('cliente-ejemplo.com')
    expect(safeErr({ message: `x ${EMAIL}` }).message).not.toContain('cliente-ejemplo.com')
    expect(safeErr(null)).toBeInstanceOf(Error)
  })
  describe('correos y secretos (fail-closed)', () => {
    const msg = (input: string) => safeErr(new Error(input)).message
    it.each([
      ['local con ñ y acentos', 'rechazado ñandú.pérez@cliente.co fin', ['ñandú', 'pérez', 'cliente.co']],
      ['local de 100 caracteres', `x ${'l'.repeat(100)}@dominio-largo.example y`, ['llll', 'dominio-largo']],
      ['dominio IDN', 'a usuario@münchen.de b', ['usuario', 'münchen']],
    ])('correo: %s', (_n, input, leaks) => {
      const out = msg(input)
      expect(out).toContain('[correo]')
      for (const l of leaks) expect(out).not.toContain(l)
    })
    it.each([
      ['?api_key=S3CR3T', 'S3CR3T'],
      ['&client_secret=S3CR3T', 'S3CR3T'],
      ['x-amz-signature=S3CR3T', 'S3CR3T'],
      ['?auth_token=S3CR3T', 'S3CR3T'],
      ['?sig=S3CR3T', 'S3CR3T'],
      ['session=S3CR3T', 'S3CR3T'],
      ['password=S3CR3T', 'S3CR3T'],
    ])('par secreto %s', (input, leak) => {
      expect(msg(`fallo ${input} fin`)).not.toContain(leak)
    })
    it('la query entera de una URL se enmascara', () => {
      expect(msg('GET https://h.test/x?foo=bar&n=1 falló')).toBe('GET https://h.test/x?[redacted] falló')
    })
    it.each([
      ['x.https://h/p?sig=abc&x=1', 'x.https://h/p?[redacted]'],
      ['-https://h?a=b', '-https://h?[redacted]'],
      ['a+https://h?k=v', 'a+https://h?[redacted]'],
    ])('query enmascarada aunque el esquema siga a . + -: %s', (input, expected) => {
      expect(msg(input)).toBe(expected)
    })
    it('credenciales embebidas en la URL (userinfo)', () => {
      const out = msg('conexión https://admin:S3cr3t@smtp.ejemplo.com:587/x falló')
      expect(out).not.toContain('admin')
      expect(out).not.toContain('S3cr3t')
      expect(out).toContain('[correo]') // fail-closed: el token con @ se enmascara completo
    })
    it.each([
      ['@alice@example.com', ['alice', 'example.com']],
      ['a@b@alice@example.com', ['alice', 'example.com']],
      ['x@y@user@dom', ['user', 'dom']],
      ['to=@ana@x.com', ['ana', 'x.com']],
    ])('correo con @ como frontera: %s', (input, leaks) => {
      const out = msg(`falló ${input} fin`)
      for (const l of leaks) expect(out).not.toContain(l)
      expect(out).toContain('[correo]')
    })
    it('userinfo con @ en la clave: se enmascara hasta la ÚLTIMA @', () => {
      const out = msg('conexión https://admin:p@ss@w0rd@smtp.ejemplo.com:587 falló')
      for (const l of ['admin', 'p@ss', 'w0rd', 'ss']) expect(out).not.toContain(l)
      expect(out).toContain('[correo]') // fail-closed: el token con @ se enmascara completo
    })
    it('claves con formato conocido', () => {
      for (const k of ['sk-abcdefghijklmnop1234', 'sb_secret_abcdef123456', 'AIzaSyabcdefghijklmnopqrstuvw', 'ghp_abcdefghijklmnopqrstuv1234', 'github_pat_abcdefghijklmnopqrstuv_12']) {
        expect(msg(`clave ${k} fin`)).not.toContain(k)
      }
    })
    it('un texto normal queda idéntico', () => {
      expect(msg('Recipient rejected for order 123')).toBe('Recipient rejected for order 123')
    })
  })
  it.each([
    ['a@ repetido', 'a@'.repeat(100000)],
    ['a repetido', 'a'.repeat(200000)],
    ['60a+@ repetido', ('a'.repeat(60) + '@').repeat(3000)],
    ['a@b. repetido', 'a@b.'.repeat(50000)],
    ['racha sin =', 'k'.repeat(100000)],
    ['eyJ repetido', 'eyJ'.repeat(60000)],
    ['a. repetido x10000', 'a.'.repeat(10000)],
    ['a- repetido x10000', 'a-'.repeat(10000)],
    ['a. repetido x100000', 'a.'.repeat(100000)],
    ['http://a/ repetido', 'http://a/'.repeat(30000)],
    ['x:/ repetido', 'x:/'.repeat(60000)],
    ['a.http:// repetido', 'a.http://'.repeat(40000)],
    ['-http:// repetido', '-http://'.repeat(40000)],
    ['http://u repetido', 'http://u'.repeat(40000)],
    ['a:// repetido', 'a://'.repeat(50000)],
  ])('lineal: %s en < 200 ms', (_n, input) => {
    const e = new Error(input)
    e.stack = input
    const t = performance.now()
    safeErr(e)
    const ms = performance.now() - t
    console.log(`[ms] ${_n}: ${ms.toFixed(1)}`)
    expect(ms).toBeLessThan(200)
  })
})
