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
      SELECT year, content
      FROM yearlyaim
      WHERE year = $1
    `,
    [year],
  );

  return result.rows[0] ?? { year, content: "" };
});
