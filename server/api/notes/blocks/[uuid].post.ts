export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, "uuid");
  const { type } = await readBody<{ type: string }>(event);
  if (!uuid || !type) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing note UUID or block type",
    });
  }
  const result = await pool.query(
    `
        INSERT INTO note_blocks
        (note_id, type, position)
        VALUES (
            $1,
            $2,
            COALESCE(
                (SELECT MAX(position) + 1
                 FROM note_blocks
                 WHERE note_id = $1),
                0
            )
        )
        RETURNING *;
        `,
    [uuid, type],
  );
  return result.rows[0];
});
