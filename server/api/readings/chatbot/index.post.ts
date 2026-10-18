export default defineEventHandler(async (event) => {
    const result = await pool.query(
        `
        INSERT INTO conversations (title)
        VALUES ('New chat')
        RETURNING id, title, created_at
        `,
    );

    return result.rows[0];
});
