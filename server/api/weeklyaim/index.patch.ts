export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, aims } = body;

  if (!Number.isInteger(id) || typeof aims !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "id and aims are required",
    });
  }

  const result = await pool.query(
    `
      UPDATE weeklyaim
      SET aims = $1
      WHERE id = $2
      RETURNING id, weeknum, year, aims
    `,
    [aims, id],
  );

  return result.rows;
});