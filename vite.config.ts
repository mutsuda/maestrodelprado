import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const DATABASE_ID = "2ed458a818df8095a9b8daa08c51418a";

function extractPropertyValue(property: any): any {
  if (!property) return null;
  switch (property.type) {
    case "title":
      return property.title?.map((t: any) => t.plain_text).join("") || "";
    case "rich_text":
      return property.rich_text?.map((t: any) => t.plain_text).join("") || "";
    case "number":
      return property.number;
    case "url":
      return property.url || "";
    case "select":
      return property.select?.name || "";
    case "multi_select":
      return property.multi_select?.map((s: any) => s.name).join(", ") || "";
    case "checkbox":
      return property.checkbox;
    case "date":
      return property.date?.start || "";
    case "files":
      if (property.files && property.files.length > 0) {
        const file = property.files[0];
        return file.file?.url || file.external?.url || "";
      }
      return "";
    default:
      return "";
  }
}

function notionDevProxy(apiKey: string): Plugin {
  return {
    name: "notion-dev-proxy",
    configureServer(server) {
      server.middlewares.use("/.netlify/functions/notion", async (_req, res) => {
        if (!apiKey) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "NOTION_API_KEY not set in .env.local" }));
          return;
        }

        try {
          const allResults: any[] = [];
          let hasMore = true;
          let startCursor: string | undefined;

          while (hasMore) {
            const body: any = {};
            if (startCursor) body.start_cursor = startCursor;

            const response = await fetch(
              `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  "Notion-Version": "2022-06-28",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
              }
            );

            if (!response.ok) {
              const errorText = await response.text();
              res.statusCode = response.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: `Notion API error: ${response.status}`, details: errorText }));
              return;
            }

            const data = await response.json();
            allResults.push(...data.results);
            hasMore = data.has_more;
            startCursor = data.next_cursor;
          }

          const transformed = allResults.map((page: any) => {
            const result: any = { id: page.id };
            if (page.properties) {
              for (const [key, value] of Object.entries(page.properties)) {
                result[key] = extractPropertyValue(value);
              }
            }
            return result;
          });

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(transformed));
        } catch (error: any) {
          console.error("Dev proxy error:", error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        notionDevProxy(env.NOTION_API_KEY),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
