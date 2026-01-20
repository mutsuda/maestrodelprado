
import { Artwork } from "../types";

const DATABASE_ID = "2ed458a818df8095a9b8daa08c51418a";
const PUBLIC_API_URL = `https://notion-api.splitbee.io/v1/table/${DATABASE_ID}`;

export const fetchNotionArtworks = async (): Promise<Artwork[]> => {
  try {
    const response = await fetch(PUBLIC_API_URL);

    if (!response.ok) {
      throw new Error(`Error de conexión: ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error("La respuesta de Notion no es una lista válida:", data);
      return [];
    }

    return data.map((item: any) => {
      // Helper para asegurar que siempre trabajamos con strings, incluso si Notion devuelve arrays o números
      const safeString = (val: any) => {
        if (val === null || val === undefined) return "";
        if (Array.isArray(val)) return val.join(", ");
        return String(val);
      };

      const title = safeString(item.Title || item.Obra || item.Name || "Obra sin título");
      const artist = safeString(item.Author || item.Artista || "Autor desconocido");
      const chapter = parseInt(item.Chapter) || 0;
      const order = parseInt(item.Order) || 0;
      const year = safeString(item.Year || "");
      const museumName = safeString(item.Museum || "");
      const museumUrl = safeString(item.museum_url || "");
      const description = safeString(item.Description || "");
      
      // La imagen viene de image_url
      let imageUrl = item.image_url || "";
      
      if (Array.isArray(imageUrl) && imageUrl.length > 0) {
        imageUrl = imageUrl[0].url || imageUrl[0].rawUrl || imageUrl[0];
      }

      if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
        imageUrl = `https://picsum.photos/seed/${encodeURIComponent(title)}/800/600`;
      }

      return {
        id: item.id || Math.random().toString(36).substr(2, 9),
        title,
        artist,
        chapter,
        chapterTitle: `Capítulo ${chapter}`,
        description,
        imageUrl,
        year,
        order,
        museumName,
        museumUrl
      };
    }).sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Fallo crítico al leer Notion:", error);
    throw error;
  }
};
