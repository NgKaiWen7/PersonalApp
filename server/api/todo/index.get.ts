export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const date = query.date;

    const result = await pool.query(
        `
            SELECT uuid, title, description
            FROM todo
            WHERE date = $1
        `,
        [date],
    );

    if (result.rows.length === 0) {
        const created = await pool.query(
            `
                INSERT INTO todo (title, description, date)
                VALUES ($1, $2, $3)
                RETURNING uuid, title, description
            `,
            ["", "", date],
        );

        return [created.rows[0]];
    }

    return result.rows;
});
