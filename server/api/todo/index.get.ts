import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const date = query.date;

  const result = await pool.query(
    `
      SELECT uuid, title, description
      FROM todo
      WHERE date = $1
    `,
    [date],
  );

  return result.rows;
});
