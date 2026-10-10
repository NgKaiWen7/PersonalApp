
import { pool2 } from "../../utils/db";
import type { Book } from "~~/shared/types/book";

export default defineEventHandler(async (event): Promise<Book> => {
  const body = await readBody<Book>(event);

  const result = await pool2.query<{uuid: string}>(
    `
    UPDATE books SET
      title = $1,
      category = $2,
      status = $3,
      description = $4
    WHERE uuid == $5
    `,
    [
      body.title,
      body.category,
      body.status,
      body.description,
      body.id,
    ],
  );

  setResponseStatus(event, 201);

  return result.rows[0];
});
