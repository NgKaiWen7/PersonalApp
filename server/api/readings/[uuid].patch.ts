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
  const result = await pool2.query(
    `
    UPDATE books SET
      title = $1,
      category = $2,
      status = $3,
      description = $4
    WHERE id = $5
    `,
    [
      body.title,
      body.category ? [body.category] : [],
      body.status,
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

  setResponseStatus(event, 204);
  return;
});
