/**
 * Error saneado para los logs. Los errores de SMTP/Graph/gateway traen direcciones de correo, tokens o URLs
 * firmadas en `message`/`stack`, y el logger de plataforma conserva ambos tal cual. Siempre se loguea
 * `err: safeErr(e)`, nunca el error crudo.
 *
 * Devuelve un Error NUEVO: mismo `name`, `message` y `stack` enmascarados y truncados, sin `cause`, `config`
 * ni propiedades extra. Las regex usan lookbehind (sin cotas de longitud) y la entrada se
 * recorta antes de aplicarlas, así que el costo es lineal incluso con 200 000 caracteres hostiles.
 */
const MAX_MESSAGE = 500
const MAX_STACK = 1500
/** Tope previo a las regex; muy por encima de lo que se conserva, para no cortar un secreto justo en el borde. */
const MAX_INPUT = 20_000

// Fail-closed y de tiempo lineal: sin cotas de longitud que dejen secretos a medias, y todo arranque de regex
// lleva un lookbehind que lo ancla al inicio de una racha (así ninguna entrada hostil produce backtracking cuadrático).
// Cualquier token con forma `algo@algo` (sin restricción a ASCII ni de longitud) -> [correo].
const EMAIL_RE = /(?<![^\s<>"'(),;:[\]{}])[^\s@<>"'(),;:[\]{}]+@[^\s@<>"'(),;:[\]{}]+/gu
// La query ENTERA de cualquier URL.
// Se captura la URL completa (siempre coincide, así que no hay reintentos cuadráticos dentro de una racha) y se corta en la primera `?`.
const URL_RE = /(?<![A-Za-z0-9])https?:\/\/[^\s"'<>#]*/gi
// Credenciales embebidas (userinfo; codiciosa hasta la ÚLTIMA @ antes del host): scheme://usuario:clave@host -> scheme://[redacted]@host. Va ANTES de la regla de correos.
const URL_USERINFO_RE = /((?<![A-Za-z0-9+.-])[a-z][a-z0-9+.-]*:\/\/)[^\s/?#]*@/gi
// Fuera de URLs: pares nombre=valor cuyo nombre TERMINE en una palabra sensible (api_key, client_secret, x-amz-signature...).
const SECRET_PAIR_RE =
  /(?<![\w.-])([\w.-]*(?:token|key|secret|signature|sig|password|passwd|pass|auth|credential|session))=[^&\s"'#]*/gi
// Segunda pasada: cualquier token delimitado por espacios que aún contenga @ (p. ej. `@alice@example.com`, `x@y@user@dom`).
const AT_TOKEN_RE = /(?<![^\s<>"'])[^\s<>"']*@[^\s<>"']*/g
const BEARER_RE = /(?<![A-Za-z0-9_-])Bearer\s+[A-Za-z0-9._~+/=-]+/gi
const BASIC_RE = /(?<![A-Za-z0-9_-])Basic\s+[A-Za-z0-9+/=]+/gi
const JWT_RE = /(?<![A-Za-z0-9_-])eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*/g
// Formatos de clave conocidos: sk-, sb_secret_, AIza..., ghp_, github_pat_.
const KEY_FORMAT_RE =
  /(?<![A-Za-z0-9_-])(?:sk-[A-Za-z0-9_-]{8,}|sb_secret_[A-Za-z0-9_-]+|AIza[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})/g

export function redact(text: string): string {
  return text
    .slice(0, MAX_INPUT)
    .replace(URL_RE, (url) => {
      const q = url.indexOf('?')
      return q === -1 ? url : `${url.slice(0, q)}?[redacted]`
    })
    .replace(URL_USERINFO_RE, '$1[redacted]@')
    .replace(JWT_RE, '[jwt]')
    .replace(KEY_FORMAT_RE, '[clave]')
    .replace(BEARER_RE, 'Bearer [redactado]')
    .replace(BASIC_RE, 'Basic [redactado]')
    .replace(SECRET_PAIR_RE, '$1=[redacted]')
    .replace(EMAIL_RE, '[correo]')
    .replace(AT_TOKEN_RE, '[correo]')
}

export function safeErr(e: unknown): Error {
  let name = 'Error'
  let message = ''
  let stack = ''
  if (e instanceof Error) {
    name = e.name || 'Error'
    message = e.message
    stack = e.stack ?? ''
  } else if (typeof e === 'string') {
    message = e
  } else if (e && typeof e === 'object' && typeof (e as { message?: unknown }).message === 'string') {
    message = (e as { message: string }).message
  } else if (e !== null && e !== undefined) {
    message = 'valor no Error'
  }
  const out = new Error(redact(message).slice(0, MAX_MESSAGE))
  Object.defineProperty(out, 'name', { value: redact(name).slice(0, 100), enumerable: false, writable: true, configurable: true })
  out.stack = stack ? redact(stack).slice(0, MAX_STACK) : undefined
  return out
}
