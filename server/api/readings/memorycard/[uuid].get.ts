// server/api/readings/memorycard/[uuid].get.ts

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "uuid")

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Chapter UUID is required",
    })
  }

  const query = getQuery(event)

  const page = Math.max(1, Math.floor(Number(query.page) || 1))
  const limit = Math.min(
    100,
    Math.max(1, Math.floor(Number(query.limit) || 10)),
  )
  const offset = (page - 1) * limit

  const countResult = await pool2.query(
    `
    SELECT COUNT(*)::int AS total
    FROM book_chapters bchap
    JOIN book_chunks bchunk ON bchap.id = bchunk.chapter_id
    JOIN memory_cards mc ON bchunk.id = mc.chunk_id
    WHERE bchap.id = $1
    `,
    [id],
  )

  const total = countResult.rows[0].total

  const result = await pool2.query(
    `
    SELECT
      mc.*,
      bchap.title AS chapter,
      bchunk.position
    FROM book_chapters bchap
    JOIN book_chunks bchunk ON bchap.id = bchunk.chapter_id
    JOIN memory_cards mc ON bchunk.id = mc.chunk_id
    WHERE bchap.id = $1
    ORDER BY bchunk.position, mc.id
    LIMIT $2 OFFSET $3
    `,
    [id, limit, offset],
  )

  return {
    items: result.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
})
