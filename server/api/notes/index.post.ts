export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const bookId = String(body.book_id ?? "").trim();
    const bookColumn = bookId ? ", book_id" : "";
    const bookValue = bookId ? ", $5" : "";
    const values = bookId
        ? [
              body.title ?? "",
              body.description ?? "",
              body.category ?? "",
              body.content ?? "",
              bookId,
          ]
        : [
              body.title ?? "",
              body.description ?? "",
              body.category ?? "",
              body.content ?? "",
          ];
    const result = await pool.query(
        `
        INSERT INTO notes (
            title,
            description,
            category,
            content${bookColumn}
        )
        VALUES ($1, $2, $3, $4${bookValue})
        RETURNING
            id,
            title,
            description,
            category,
            content,
            last_edited_date
        `,
        values,
    );

    return result.rows[0];
});
