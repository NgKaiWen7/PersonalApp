export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, aims } = body;
  if (id == null || typeof aims !== "string") {
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
  if (result.rowCount === 0){
    throw createError({
      statusCode: 400,
      statusMessage: "Error Updating weeklyaim",
    });
  }

  return result.rows;
});