import { pool2 } from "../../utils/db";
import type { BookListItem } from "~~shared/types/book";

export default defineEventHandler(async () => {
  const result = await pool2.query<BookListItem>(
    `
    SELECT
      id,
      title,
      category,
      status,
      last_read,
      description,
      source,
      created_at
    FROM books
    ORDER BY created_at DESC NULLS LAST, title ASC
    `,
  );
  return result.rows;
});
