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
      INSERT INTO yearlyaim (year, content)
      VALUES ($1, $2)
      ON CONFLICT (year)
      DO UPDATE SET content = EXCLUDED.content
      RETURNING year, content
    `,
    [year, content],
  );

  return result.rows[0];
});
