export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const year = Number(query.year);
  if (!Number.isInteger(year)) {
    throw createError({
      statusCode: 400,
      statusMessage: "year is required",
    });
  }

  const result = await pool.query(
    `
      SELECT id, weeknum, year, aims
      FROM weeklyaim
      WHERE year = $1
      ORDER BY weeknum ASC
    `,
    [year],
  );
  console.log(result.rows)
  return result.rows;
});
