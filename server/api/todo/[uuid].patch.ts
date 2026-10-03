import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, "uuid");

  const body = await readBody(event);

  const result = await pool.query(
    `
      UPDATE todo
      SET
        title = $1,
        description = $2
      WHERE uuid = $3
      RETURNING uuid, title, description, date
    `,
    [
      body.title,
      body.description,
      uuid,
    ],
  );

  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Todo not found",
    });
  }

  return result.rows[0];
});
