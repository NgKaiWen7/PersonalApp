import { getCookie } from "h3"

export default defineEventHandler(async (event) => {
    const token = getCookie(event, "session")

    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        })
    }

    const result = await pool.query(
        `
        SELECT id, username
        FROM users
        WHERE token = $1
          AND validated_date > NOW() - INTERVAL '30 days'
        `,
        [token],
    )

    if (result.rowCount === 0) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        })
    }

    return result.rows[0]
})
