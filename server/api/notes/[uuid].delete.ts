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
        DELETE FROM notes
        WHERE id = $1
        `,
        [uuid],
    );
  return result.rows[0];
});
