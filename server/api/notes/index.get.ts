import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const search = String(query.search ?? "").trim();
    const bookId = String(query.book_id ?? "").trim();
    const offset = (page - 1) * limit;
    const bookFilter = bookId ? "AND book_id = $2" : "";
    const paginationStart = bookId ? 3 : 2;
    const params = bookId
        ? [search, bookId, limit, offset]
        : [search, limit, offset];

    const result = await pool.query(
        `
            SELECT *
            FROM notes
            WHERE (
                $1 = ''
                OR title ILIKE '%' || $1 || '%'
            )
            ${bookFilter}
            ORDER BY last_edited_date DESC
            LIMIT $${paginationStart} OFFSET $${paginationStart + 1}
        `,
        params,
    );

    const count = await pool.query(
        `
            SELECT COUNT(*)::INTEGER AS total
            FROM notes
            WHERE (
                $1 = ''
                OR title ILIKE '%' || $1 || '%'
            )
            ${bookFilter}
        `,
        bookId ? [search, bookId] : [search],
    );

    const total = count.rows[0].total;

    return {
        items: result.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
});
