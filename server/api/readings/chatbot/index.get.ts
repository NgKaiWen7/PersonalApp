export default defineEventHandler(async () => {
    const result = await pool.query(`
        SELECT
            c.id,
            c.title,
            c.created_at,
            MAX(m.created_at) AS last_message_at
        FROM conversations c
        LEFT JOIN messages m
            ON m.conversation_id = c.id
        GROUP BY c.id
        ORDER BY last_message_at DESC NULLS LAST
    `);

    return result.rows.map((row) => ({
        id: row.id,
        title: row.title,
    }));
});
