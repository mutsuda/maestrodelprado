const DATABASE_ID = "2ed458a818df8095a9b8daa08c51418a";

function extractPropertyValue(property) {
  if (!property) return null;

  switch (property.type) {
    case "title":
      return property.title?.map((t) => t.plain_text).join("") || "";
    case "rich_text":
      return property.rich_text?.map((t) => t.plain_text).join("") || "";
    case "number":
      return property.number;
    case "url":
      return property.url || "";
    case "select":
      return property.select?.name || "";
    case "multi_select":
      return property.multi_select?.map((s) => s.name).join(", ") || "";
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
    case "formula":
      if (property.formula?.type === "string") return property.formula.string || "";
      if (property.formula?.type === "number") return property.formula.number;
      if (property.formula?.type === "boolean") return property.formula.boolean;
      return "";
    default:
      return "";
  }
}

function transformPage(page) {
  const result = { id: page.id };
  if (page.properties) {
    for (const [key, value] of Object.entries(page.properties)) {
      result[key] = extractPropertyValue(value);
    }
  }
  return result;
}

export const handler = async (event) => {
  const NOTION_API_KEY = process.env.NOTION_API_KEY;

  if (!NOTION_API_KEY) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "NOTION_API_KEY is not configured" }),
    };
  }

  try {
    const allResults = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
      const requestBody = {};
      if (startCursor) requestBody.start_cursor = startCursor;

      const response = await fetch(
        `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${NOTION_API_KEY}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Notion API error:", response.status, errorText);
        return {
          statusCode: response.status,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            error: `Notion API error: ${response.status}`,
            details: errorText,
          }),
        };
      }

      const data = await response.json();
      allResults.push(...data.results);
      hasMore = data.has_more;
      startCursor = data.next_cursor;
    }

    const transformed = allResults.map(transformPage);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
      body: JSON.stringify(transformed),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
