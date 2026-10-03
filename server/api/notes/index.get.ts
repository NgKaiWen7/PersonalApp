import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const result = await pool.query(
    `
      SELECT *
      FROM notes
      ORDER BY last_edited_date DESC
    `
  );
  return result.rows;
});
