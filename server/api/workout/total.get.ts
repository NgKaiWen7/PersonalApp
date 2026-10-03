import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const result = await pool.query(
    `
    SELECT COALESCE(SUM(weight * reps), 0)::float8 AS total
    FROM workouts
    WHERE (created_at AT TIME ZONE 'Asia/Kuala_Lumpur')::date =
          (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kuala_Lumpur')::date
    `,
  );
  console.log(result.rows[0]);
  return result.rows[0].total;
});
