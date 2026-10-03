import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const result = await pool.query(
    `
      INSERT INTO workouts
      (exercise_type, reps, weight)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    [
      body.exercise,
      body.reps,
      body.weight,
    ],
  );

  return result.rows[0];
});
