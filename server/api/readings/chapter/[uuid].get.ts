import { pool2 } from "../../../utils/db";


export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "uuid");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Book UUID is required",
    });
  }

  const result = await pool2.query(
    `
    select * from book_chapters
    where book_chapters.book_id = $1
    `,
    [id],
  );
  return result.rows
})
