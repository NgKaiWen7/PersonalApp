import { readFile } from "node:fs/promises";
import { pool2 } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "uuid");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing card UUID",
    });
  }

  const result = await pool2.query<{ image_path: string }>(
    `
    SELECT image_path
    FROM cards
    WHERE id = $1
      AND image_path IS NOT NULL
    LIMIT 1
    `,
    [id],
  );

  const imagePath = result.rows[0]?.image_path;
  if (!imagePath) {
    throw createError({
      statusCode: 404,
      statusMessage: "Image not found",
    });
  }

  try {
    const image = await readFile(imagePath);
    setHeader(event, "Content-Type", "image/png");
    setHeader(event, "Cache-Control", "public, max-age=86400");
    return image;
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "Image file not found",
    });
  }
});
