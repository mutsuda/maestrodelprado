import { Artwork } from "../types";

const API_URL = "/.netlify/functions/notion";

export const fetchNotionArtworks = async (): Promise<Artwork[]> => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API error:", response.status, errorBody);
      throw new Error(`Error de conexión: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("La respuesta no es una lista válida:", data);
      return [];
    }

    return data.map((item: any) => {
      const safeString = (val: any): string => {
        if (val === null || val === undefined) return "";
        if (Array.isArray(val)) return val.join(", ");
        return String(val);
      };

      const safeNumber = (val: any): number => {
        if (typeof val === "number") return val;
        return parseInt(val) || 0;
      };

      const title = safeString(item.Title || item.Obra || item.Name || "Obra sin título");
      const artist = safeString(item.Author || item.Artista || "Autor desconocido");
      const chapter = safeNumber(item.Chapter);
      const order = safeNumber(item.Order);
      const year = safeString(item.Year || "");
      const museumName = safeString(item.Museum || "");
      const museumUrl = safeString(item.museum_url || "");
      const description = safeString(item.Description || "");

      let imageUrl = item.image_url || "";

      if (Array.isArray(imageUrl) && imageUrl.length > 0) {
        imageUrl = imageUrl[0].url || imageUrl[0].rawUrl || imageUrl[0];
      }

      if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.startsWith("http")) {
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
        museumUrl,
      };
    }).sort((a: Artwork, b: Artwork) => a.order - b.order);
  } catch (error) {
    console.error("Fallo crítico al leer Notion:", error);
    throw error;
  }
};
