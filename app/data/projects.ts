export type Project = {
  id: string
  slug: string
  title: string
  category: string
  description: string
  heroImage: {
    src: string
    alt: string
    width: number
    height: number
  }
  galleryImages: {
    src: string
    alt: string
    width: number
    height: number
  }[]
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'shooting-portrait',
    title: 'Shooting Portrait',
    category: 'Portrait',
    description:
      'Une série de portraits capturant l\'essence et la personnalité de chaque sujet. Jeu de lumière naturelle et poses spontanées pour révéler l\'authenticité.',
    heroImage: {
      src: '/images/dexnill rouge defaut.JPG',
      alt: 'Shooting Portrait Hero',
      width: 1920,
      height: 1080,
    },
    galleryImages: [
      {
        src: '/images/dexnill rouge defaut.JPG',
        alt: 'Portrait 1',
        width: 800,
        height: 1200,
      },
      {
        src: '/images/dexnill rouge defaut.JPG',
        alt: 'Portrait 2',
        width: 800,
        height: 1200,
      },
      {
        src: '/images/dexnill rouge defaut.JPG',
        alt: 'Portrait 3',
        width: 800,
        height: 1200,
      },
    ],
  },
  {
    id: '2',
    slug: 'projet-fashion',
    title: 'Projet Fashion',
    category: 'Mode',
    description:
      'Collection de mode contemporaine mêlant élégance et audace. Collaboration avec des créateurs émergents pour une vision unique du style moderne.',
    heroImage: {
      src: '/images/dexnill rouge defaut.JPG',
      alt: 'Projet Fashion Hero',
      width: 1920,
      height: 1080,
    },
    galleryImages: [
      {
        src: '/images/dexnill rouge defaut.JPG',
        alt: 'Fashion 1',
        width: 800,
        height: 1200,
      },
      {
        src: '/images/dexnill rouge defaut.JPG',
        alt: 'Fashion 2',
        width: 800,
        height: 1200,
      },
    ],
  },
  {
    id: '3',
    slug: 'session-studio',
    title: 'Session Studio',
    category: 'Studio',
    description:
      'Séance en studio avec un contrôle total de la lumière et de l\'ambiance. Exploration des contrastes et des textures dans un environnement maîtrisé.',
    heroImage: {
      src: '/images/dexnill rouge defaut.JPG',
      alt: 'Session Studio Hero',
      width: 1920,
      height: 1080,
    },
    galleryImages: [
      {
        src: '/images/dexnill rouge defaut.JPG',
        alt: 'Studio 1',
        width: 800,
        height: 1200,
      },
      {
        src: '/images/dexnill rouge defaut.JPG',
        alt: 'Studio 2',
        width: 800,
        height: 1200,
      },
      {
        src: '/images/dexnill rouge defaut.JPG',
        alt: 'Studio 3',
        width: 800,
        height: 1200,
      },
    ],
  },
  {
    id: '4',
    slug: 'shooting-exterieur',
    title: 'Shooting Extérieur',
    category: 'Extérieur',
    description:
      'Photographie en extérieur capturant la beauté naturelle et l\'interaction avec l\'environnement. Lumière dorée et paysages urbains comme toile de fond.',
    heroImage: {
      src: '/images/dexnill rouge defaut.JPG',
      alt: 'Shooting Extérieur Hero',
      width: 1920,
      height: 1080,
    },
    galleryImages: [
      {
        src: '/images/dexnill rouge defaut.JPG',
        alt: 'Extérieur 1',
        width: 800,
        height: 1200,
      },
      {
        src: '/images/dexnill rouge defaut.JPG',
        alt: 'Extérieur 2',
        width: 800,
        height: 1200,
      },
    ],
  },
  {
    id: '5',
    slug: 'projet-artistique',
    title: 'Projet Artistique',
    category: 'Art',
    description:
      'Exploration artistique mêlant photographie et concepts visuels innovants. Une vision personnelle et créative repoussant les limites du médium.',
    heroImage: {
      src: '/images/dexnill rouge defaut.JPG',
      alt: 'Projet Artistique Hero',
      width: 1920,
      height: 1080,
    },
    galleryImages: [
      {
        src: '/images/dexnill rouge defaut.JPG',
        alt: 'Art 1',
        width: 800,
        height: 1200,
      },
      {
        src: '/images/dexnill rouge defaut.JPG',
        alt: 'Art 2',
        width: 800,
        height: 1200,
      },
      {
        src: '/images/dexnill rouge defaut.JPG',
        alt: 'Art 3',
        width: 800,
        height: 1200,
      },
    ],
  },
  {
    id: '6',
    slug: 'session-mode',
    title: 'Session Mode',
    category: 'Mode',
    description:
      'Séance mode sophistiquée avec une attention particulière aux détails et à la mise en scène. Élégance intemporelle et modernité se rencontrent.',
    heroImage: {
      src: '/images/dexnill rouge defaut.JPG',
      alt: 'Session Mode Hero',
      width: 1920,
      height: 1080,
    },
    galleryImages: [
      {
        src: '/images/dexnill rouge defaut.JPG',
        alt: 'Mode 1',
        width: 800,
        height: 1200,
      },
      {
        src: '/images/dexnill rouge defaut.JPG',
        alt: 'Mode 2',
        width: 800,
        height: 1200,
      },
    ],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

