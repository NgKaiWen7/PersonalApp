export default defineEventHandler(async (event) => {
    const chatUuid = getRouterParam(event, "uuid");

    if (!chatUuid) {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing chat UUID",
        });
    }

    const result = await pool.query(
        `
        DELETE FROM conversations
        WHERE id = $1
        RETURNING id
        `,
        [chatUuid],
    );

    if (result.rowCount === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: "Chat session not found",
        });
    }

    return { success: true, id: result.rows[0].id };
});
