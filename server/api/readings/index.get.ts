import { pool2 } from "../../utils/db";
import type { BookListItem } from "~~shared/types/book";

export default defineEventHandler(async () => {
  const result = await pool2.query<BookListItem>(
    `
    SELECT id, title
    FROM books
    ORDER BY title ASC
    `,
  );

  return result.rows;
});
