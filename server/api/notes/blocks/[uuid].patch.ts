export default defineEventHandler(async (event) => {
    const uuid = getRouterParam(event, "uuid");
    if (!uuid) {
        throw createError({
            statusCode: 400,
            statusMessage: "Note ID is required",
        });
    }
  const order = await readBody<string[]>(event);
    if (!Array.isArray(order)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid request body",
        });
    }
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        for (let position = 0; position < order.length; position++) {
            await client.query(
                `
                UPDATE note_blocks
                SET position = $1
                WHERE id = $2
                  AND note_id = $3
                `,
                [position, order[position], uuid],
            );
        }
        await client.query("COMMIT");
        return null;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
});
