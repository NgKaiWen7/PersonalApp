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
        SELECT id, conversation_id, role, content, created_at
        FROM messages
        WHERE conversation_id = $1
        ORDER BY created_at ASC, id ASC
        `,
        [chatUuid],
    );

    return result.rows;
});
