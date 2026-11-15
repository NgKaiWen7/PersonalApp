export default defineEventHandler(async (event) => {
    const uuid = getRouterParam(event, "uuid");

    if (!uuid) {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing note UUID",
        });
    }

    const result = await pool2.query(
        `
        SELECT
            id,
            title,
            description,
            category,
            content
        FROM notes
        WHERE id = $1
        `,
        [uuid],
    );
    if (result.rows.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Note Not Found',
            fatal: true
        })
    }
    return result.rows[0];
});
