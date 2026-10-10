import { pool2 } from "../../utils/db";
import type { BookListItem } from "~~shared/types/book";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "uuid");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Book ID is required",
    });
  }

  const result = await pool2.query<BookListItem>(
    `
    SELECT id, title, category, status, description, source
    FROM books
    WHERE id = $1
    `,
    [id],
  );

  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Book not found",
    });
  }

  return result.rows[0];
});
