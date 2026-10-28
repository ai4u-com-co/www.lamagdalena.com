/**
 * Contenido de la landing de Cauce.
 * Fuente: "Cauce by La Magdalena · Portafolio 2026" (cifras, casos, clientes, servicios)
 * y el diseño web aprobado (estructura y textos de hero, círculo de oro y contacto).
 * No agregar cifras que no estén en esas fuentes.
 */

export const INSTAGRAM_URL = 'https://www.instagram.com/cauce_estudio'
export const INSTAGRAM_HANDLE = '@cauce_estudio'

export const NAV_LINKS = [
  { label: 'Estudio', href: '#estudio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Método', href: '#metodo' },
  { label: 'Casos', href: '#casos' },
] as const

export const PROOF = [
  { value: '+3 M', label: 'vistas en un solo episodio de Café Diverso' },
  { value: '+200 mil', label: 'seguidores en TikTok, desde 70 mil' },
  { value: '+40', label: 'entrevistas con líderes de diversidad' },
] as const

export const SERVICES = [
  {
    id: 'reputacion',
    title: 'Estrategia de reputación',
    text: 'Definición de propósito, posicionamiento y hoja de ruta de comunicación con impacto medible en el negocio.',
  },
  {
    id: 'storytelling',
    title: 'Storytelling & copy',
    text: 'Narrativas corporativas que conectan propósito e impacto con audiencias clave: clientes, inversionistas y colaboradores.',
  },
  {
    id: 'audiovisual',
    title: 'Producción audiovisual',
    text: 'Fotografía y video corporativo alineados a objetivos de negocio, marca y comunicación externa.',
  },
  {
    id: 'consultoria',
    title: 'Consultoría de impacto',
    text: 'Alineación entre gestión, comunicación y reporte de resultados, con indicadores verificables.',
  },
] as const

export const GOLDEN_CIRCLE = [
  {
    key: 'por-que',
    n: '01',
    title: 'Por qué',
    text: 'Empezamos por el propósito: la creencia que mueve a tu marca.',
  },
  {
    key: 'como',
    n: '02',
    title: 'Cómo',
    text: 'Traducimos ese porqué en una narrativa y una estrategia distintas.',
  },
  {
    key: 'que',
    n: '03',
    title: 'Qué',
    text: 'Lo hacemos tangible: contenido, piezas y experiencias que dejan huella.',
  },
] as const

export const METHOD = [
  {
    n: '01',
    title: 'Investigación',
    text: 'Diagnóstico del entorno, los retos de negocio y las oportunidades de posicionamiento. Análisis de contexto, referentes y mapeo de actores clave.',
  },
  {
    n: '02',
    title: 'Inmersión',
    text: 'Trabajo de campo dentro de la organización y su territorio. Co-creamos con los equipos internos para identificar los hallazgos que sustentan la estrategia.',
  },
  {
    n: '03',
    title: 'Oportunidades',
    text: 'Priorizamos las narrativas con mayor potencial de reputación y retorno, en el punto donde propósito y negocio convergen.',
  },
  {
    n: '04',
    title: 'Implementación',
    text: 'Activamos el sistema narrativo en piezas, formatos y canales, con lineamientos claros para que el equipo lo sostenga de forma autónoma.',
  },
  {
    n: '05',
    title: 'Medición',
    text: 'Definimos indicadores de reputación, alcance e impacto para reportar resultados y sustentar la inversión ante la organización.',
  },
] as const

export interface Caso {
  slug: string
  cliente: string
  titulo: string
  tipo: string
  imagen: string
  alt: string
  reto: string
  solucion: string
  listaTitulo: 'Resultados' | 'Entregables'
  lista: readonly string[]
}

export const CASOS: readonly Caso[] = [
  {
    slug: 'cafe-diverso',
    cliente: 'Bancolombia',
    titulo: 'Café Diverso',
    tipo: 'Storytelling + producción audiovisual',
    imagen: '/cauce/casos/cafe-diverso.webp',
    alt: 'Pieza gráfica ilustrada del formato Café Diverso en la pantalla de un celular',
    reto: 'Crear contenido de valor que promoviera conversaciones de diversidad sin hablar de las acciones puntuales del banco.',
    solucion:
      'Un formato de entrevistas sobre diversidad con expertos, líderes y activistas que generan consciencia sobre estos temas.',
    listaTitulo: 'Resultados',
    lista: [
      'Formato fijo y referente desde 2021.',
      'Episodios con +3 millones de vistas.',
      'TikTok: de 70 mil a +200 mil seguidores.',
      '+40 entrevistas con líderes de diversidad.',
    ],
  },
  {
    slug: 'medellin-music-lab',
    cliente: 'Alcaldía de Medellín',
    titulo: 'Medellín Music Lab',
    tipo: 'Estrategia de marca · con Puro Studio y Macho Group',
    imagen: '/cauce/casos/medellin-music-lab.webp',
    alt: 'Presentación de Medellín Music Lab en un escenario con pantalla naranja',
    reto: 'Construir la identidad y estrategia de marca para la plataforma de música de la Secretaría de la Juventud de Medellín.',
    solucion:
      'Desarrollamos la estrategia en alianza, definiendo territorio, tono y sistema para conectar con la juventud y la escena musical de la ciudad.',
    listaTitulo: 'Resultados',
    lista: ['Marca institucional con identidad propia.', 'Plataforma de ciudad para nuevos talentos.', 'Alianza con Puro Studio y Macho Group.'],
  },
  {
    slug: 'puntos-colombia',
    cliente: 'Puntos Colombia',
    titulo: 'Storytelling de sostenibilidad',
    tipo: 'Estrategia de storytelling + cocreación',
    imagen: '/cauce/casos/puntos-colombia.webp',
    alt: 'Frailejón en un páramo cubierto de neblina',
    reto: 'Comunicar sostenibilidad sin caer en greenwashing ni en discursos vacíos, conectando el propósito con audiencias muy distintas: empresas, personas y aliados.',
    solucion:
      'Con un taller de cocreación construimos un sistema narrativo completo alrededor del pilar “De la lealtad al punto, del punto al impacto”.',
    listaTitulo: 'Entregables',
    lista: [
      'Nuevo pilar de comunicación: Impacto.',
      'Tagline, manifiesto y filtro de claridad.',
      'Programa de Embajadores.',
      'Guía de fotografía y video con propósito.',
    ],
  },
  {
    slug: 'loto-del-sur',
    cliente: 'Loto del Sur',
    titulo: 'El poder de los ingredientes',
    tipo: 'Estrategia de storytelling para expansión',
    imagen: '/cauce/casos/loto-del-sur.webp',
    alt: 'Flores blancas translúcidas fotografiadas a contraluz',
    reto: 'En plena expansión internacional, transformar el ingrediente de atributo a estructura narrativa exportable, integrando emoción artesanal y rigor científico.',
    solucion:
      'Diseñamos el sistema narrativo “Cosmogonía botánica” con tres pilares: ingrediente como universo, origen y territorio, ciencia y ancestralidad.',
    listaTitulo: 'Entregables',
    lista: [
      'Plataforma narrativa global y exportable.',
      'Serie hero “Cosmogonía de las plantas”.',
      'Enciclopedia de ingredientes y bitácoras.',
      'Manifiesto: el verdadero norte es el sur.',
    ],
  },
  {
    slug: 'la-rufina',
    cliente: 'La Rufina',
    titulo: 'La Rufina',
    tipo: 'Creatividad, copy y estrategia de marca',
    imagen: '/cauce/casos/la-rufina.webp',
    alt: 'Casa de vidrio iluminada al atardecer con un letrero de neón que dice “Beauty is in the heart & not the eye”',
    reto: 'Dar forma a una marca con alma propia, capaz de conectar desde la belleza y la experiencia más allá de lo literal.',
    solucion:
      'Construimos creatividad, copy y estrategia de marca: un sistema narrativo que traduce la esencia del lugar en una voz reconocible.',
    listaTitulo: 'Resultados',
    lista: ['Sistema de marca integral.', 'Narrativa y línea editorial propias.', 'Discurso coherente y distintivo.'],
  },
  {
    slug: 'the-somos-hoteles',
    cliente: 'The Somos Hoteles',
    titulo: 'The Somos Hoteles',
    tipo: 'Creatividad, copy y estrategia de marca',
    imagen: '/cauce/casos/the-somos-hoteles.webp',
    alt: 'Afiche de la campaña “Let’s make the rainbow brighter” con personajes ilustrados',
    reto: 'Articular una marca hotelera con propósito, que hablara desde valores como el diseño, la comunidad, lo local y el confort.',
    solucion:
      'Creamos la estrategia, el copy y la creatividad de marca, con campañas como “Let’s make the rainbow brighter” y “Nation of todos”, que activan comunidad y pertenencia.',
    listaTitulo: 'Resultados',
    lista: [
      'Plataforma de marca con propósito.',
      'Voz consistente en todos los canales.',
      'Campañas de comunidad, diversidad y diseño.',
    ],
  },
]

export const CLIENTES = [
  'Bancolombia',
  'Bavaria',
  'ISA',
  'Alcaldía de Medellín',
  'Comfama',
  'Hatsu',
  'Puro Studio',
  'The Somos Group',
  'Woodstore',
  'Urbania Café',
  'Agud Artista',
  'Vidrio Mejor Planeta',
  'Origen Brunch',
  'Cualquier Humano',
  'La Rufina',
  'Ciempiés Café',
] as const

export const SERVICE_OPTIONS = [
  ...SERVICES.map(s => s.title),
  'Aún no lo sé, quiero conversar',
] as const
