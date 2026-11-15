export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const bookId = String(body.book_id ?? "").trim();
    const bookColumn = bookId ? ", study_source_id" : "";
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
          try {

              const result = await pool2.query(
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
          }catch (err){
             console.error('Unknown error:', err);
          }

});
