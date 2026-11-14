import { pool2 } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = getRouterParam(event, "uuid");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Book UUID is required",
    });
  }
  const categories = Array.isArray(body.category)
    ? body.category
    : body.category
      ? [body.category]
      : [];
  const result = await pool2.query(
    `
    UPDATE books SET
      title = $1,
      category = $2::text[],
      status = $3,
      last_read = $4,
      description = $5
    WHERE id = $6
    RETURNING
      id,
      title,
      category,
      status,
      last_read,
      description,
      source,
      created_at
    `,
    [
      body.title,
      categories,
      body.status,
      body.last_read ?? null,
      body.description,
      id,
    ],
  );

  if (result.rowCount === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Book not found",
    });
  }

  return result.rows[0];
});
