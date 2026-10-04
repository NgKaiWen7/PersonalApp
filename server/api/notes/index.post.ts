export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const result = await pool.query(
        `
        INSERT INTO notes (
            title,
            description,
            category,
            content
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            id,
            title,
            description,
            category,
            content,
            last_edited_date
        `,
        [
            body.title ?? "",
            body.description ?? "",
            body.category ?? "",
            body.content ?? "",
        ],
    );

    return result.rows[0];
});
