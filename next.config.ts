import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // El lint real ya corre como step propio en CI (`npm run lint`); se
    // desacopla del lint interno de `next build` para que deuda preexistente
    // de ESLint no tumbe el build (patrón usado en otros repos del ecosistema).
    ignoreDuringBuilds: true,
  },
  async redirects() {
    // Jarupia ahora es una página del sitio (app/(public)/jarupia); la URL del HTML estático antiguo redirige.
    return [{ source: '/jarupia/index.html', destination: '/jarupia', permanent: true }]
  },
  images: {
    remotePatterns: [],
  },
  serverExternalPackages: ['@react-pdf/renderer', '@ai4u/mc-sso'],
  outputFileTracingIncludes: {
    '**': ['./public/fonts/**', './public/assets/logos/**', './data/**'],
  },
}

export default nextConfig
