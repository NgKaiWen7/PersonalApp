export default defineEventHandler(async (event) => {
    const uuid = getRouterParam(event, "uuid");
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
            description = $2
        WHERE id = $3
        RETURNING id, title, description, category
        `,
        [body.title, body.description, uuid],
    );

    if (result.rows.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: "Note not found",
        });
    }
    return result.rows[0];
});
