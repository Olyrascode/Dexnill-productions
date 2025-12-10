/**
 * Type définissant la structure d'une vidéo
 * 
 * @property id - Identifiant unique de la vidéo (string)
 * @property title - Titre de la vidéo affiché dans le carousel
 * @property src - URL ou ID de la vidéo YouTube
 *                 Formats acceptés:
 *                 - ID seul: 'YodkjkC5jkw'
 *                 - URL courte: 'https://youtu.be/YodkjkC5jkw'
 *                 - URL complète: 'https://www.youtube.com/watch?v=YodkjkC5jkw'
 * @property thumbnail - Chemin vers l'image de prévisualisation (optionnel)
 * @property duration - Durée de la vidéo au format 'MM:SS' (optionnel)
 * @property category - Catégorie de la vidéo (optionnel)
 * @property date - Date de publication (optionnel)
 */
export type Video = {
  id: string
  title: string
  src: string
  thumbnail?: string
  duration?: string
  category?: string
  date?: string
}

/**
 * Liste des vidéos affichées dans le carousel
 * 
 * Pour ajouter une nouvelle vidéo:
 * 1. Copiez un objet existant
 * 2. Changez l'id (doit être unique)
 * 3. Modifiez le title
 * 4. Remplacez src par votre ID YouTube (trouvez-le dans l'URL de votre vidéo)
 * 5. Ajustez les autres propriétés selon vos besoins
 */
export const videos: Video[] = [
  {
    id: '1',
    title: 'Shooting Portrait - Session 1',
    src: 'YodkjkC5jkw', // Juste l'ID YouTube ou l'URL complète
    thumbnail: '/images/dexnill rouge defaut.JPG',
    duration: '3:45',
    category: 'Portrait',
    date: 'Mai 2024',
  },
  {
    id: '2',
    title: 'Fashion Show - Collection 2024',
    src: 'YodkjkC5jkw',
    thumbnail: '/images/dexnill rouge defaut.JPG',
    duration: '5:20',
    category: 'Fashion',
    date: 'Juin 2024',
  },
  {
    id: '3',
    title: 'Studio Session - Behind the Scenes',
    src: 'YodkjkC5jkw',
    thumbnail: '/images/dexnill rouge defaut.JPG',
    duration: '4:15',
    category: 'BTS',
    date: 'Juillet 2024',
  },
  {
    id: '4',
    title: 'Outdoor Photography - Nature',
    src: 'YodkjkC5jkw',
    thumbnail: '/images/dexnill rouge defaut.JPG',
    duration: '6:30',
    category: 'Nature',
    date: 'Août 2024',
  },
  {
    id: '5',
    title: 'Artistic Project - Visual Story',
    src: 'YodkjkC5jkw',
    thumbnail: '/images/dexnill rouge defaut.JPG',
    duration: '7:10',
    category: 'Art',
    date: 'Septembre 2024',
  },
  {
    id: '6',
    title: 'Fashion Editorial - Urban Style',
    src: 'YodkjkC5jkw',
    thumbnail: '/images/dexnill rouge defaut.JPG',
    duration: '4:50',
    category: 'Editorial',
    date: 'Octobre 2024',
  },
]

