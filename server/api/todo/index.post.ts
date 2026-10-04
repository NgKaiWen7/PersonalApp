export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const { title, description, date } = body;

    const result = await pool.query(
        `
            INSERT INTO todo (title, description, date)
            VALUES ($1, $2, $3)
            RETURNING uuid, title, description, date
        `,
        [title, description, date],
    );

    return result.rows[0];
});
