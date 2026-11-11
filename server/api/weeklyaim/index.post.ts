export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { weeknum, aims, year } = body;

  if (!Number.isInteger(year) || !Number.isInteger(weeknum) || typeof aims !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "id and aims are required",
    });
  }

  const result = await pool.query(
    `
      INSERT INTO weeklyaim
      (weeknum, aims, year)
      VALUES ($1, $2, $3)
      RETURNING id
    `,
    [weeknum, aims, year],
  );

  return result.rows;
});