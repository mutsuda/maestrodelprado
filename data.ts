
import { Artwork } from './types';

// Estos datos actúan como fallback en caso de que la conexión directa con Notion falle.
export const ARTWORKS: Artwork[] = [
  // Fix: Added missing 'order' property required by Artwork interface
  {
    id: 'f1',
    title: 'La Gloria',
    artist: 'Tiziano',
    chapter: 1,
    chapterTitle: 'El encuentro',
    description: 'La obra que Carlos V pidió ver antes de morir. Un portal hacia el más allá.',
    imageUrl: 'https://picsum.photos/seed/prado1/800/600',
    year: '1551-1554',
    order: 1
  },
  // Fix: Added missing 'order' property required by Artwork interface
  {
    id: 'f2',
    title: 'El Jardín de las Delicias',
    artist: 'El Bosco',
    chapter: 2,
    chapterTitle: 'El bosque de las delicias',
    description: 'Un mapa del alma humana. El Bosco esconde secretos que Javier Sierra nos ayuda a descifrar.',
    imageUrl: 'https://picsum.photos/seed/prado2/800/600',
    year: '1490-1500',
    order: 2
  }
];
