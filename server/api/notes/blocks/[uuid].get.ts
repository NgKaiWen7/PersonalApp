export default defineEventHandler(async (event) => {
    const uuid = getRouterParam(event, "uuid");

    if (!uuid) {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing note UUID",
        });
    }

    const result = await pool.query(
        `
        SELECT
            id,
            note_id,
            position,
            content,
            type,
            link
        FROM note_blocks
        WHERE note_id = $1
        ORDER BY position ASC
        `,
        [uuid],
    );
  return result.rows;
});
