import { pool } from "../../utils/db";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const search = String(query.search ?? "").trim();
    const offset = (page - 1) * limit;

    const result = await pool.query(
        `
            SELECT *
            FROM notes
            WHERE (
                $1 = ''
                OR title ILIKE '%' || $1 || '%'
            )
            ORDER BY last_edited_date DESC
            LIMIT $2 OFFSET $3
        `,
        [search, limit, offset],
    );

    const count = await pool.query(
        `
            SELECT COUNT(*)::INTEGER AS total
            FROM notes
            WHERE (
                $1 = ''
                OR title ILIKE '%' || $1 || '%'
            )
        `,
        [search],
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
