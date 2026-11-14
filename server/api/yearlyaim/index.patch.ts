export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { year, content } = body;

  if (!Number.isInteger(year) || typeof content !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "year and content are required",
    });
  }

  const result = await pool.query(
    `
      UPDATE yearlyaim
      SET content = $1
      WHERE year = $2
      RETURNING year, content
    `,
    [content, year],
  );

  if (result.rowCount === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Yearly aim not found",
    });
  }

  return result.rows[0];
});
