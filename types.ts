
export interface Artwork {
  id: string;
  title: string;
  artist: string;
  chapter: number;
  chapterTitle: string;
  description: string;
  imageUrl: string;
  year?: string;
  order: number;
  museumName?: string;
  museumUrl?: string;
}

export interface Chapter {
  number: number;
  title: string;
  artworks: Artwork[];
}
