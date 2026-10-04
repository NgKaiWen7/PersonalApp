export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, "uuid");
  console.log(uuid);
  if (!uuid) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing note UUID",
    });
  }
  const body = await readBody(event);
  const result = await pool.query(
    `
        UPDATE notes
        SET
            title = $1,
            description = $2,
            content = $3
        WHERE id = $4
        RETURNING id, title, description, category, content
        `,
    [body.title, body.description, body.content, uuid],
  );

  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Note not found",
    });
  }
  return result.rows[0];
});
