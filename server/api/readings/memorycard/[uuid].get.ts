// server/api/readings/memorycard/[uuid].get.ts

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "uuid");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing book or chapter UUID",
    });
  }

  const query = getQuery(event);
  const chapterId = query.chapter_id ? String(query.chapter_id) : null;

  const search = String(query.search ?? "").trim();
  const pattern = `%${search}%`;
  console.log(pattern);

  const page = Math.max(1, Math.floor(Number(query.page) || 1));
  const limit = Math.min(
    100,
    Math.max(1, Math.floor(Number(query.limit) || 10)),
  );
  const offset = (page - 1) * limit;

  let filterSql: string;
  let filterId: string;

  if (chapterId) {
    filterSql = "bchap.id = $1";
    filterId = chapterId;
  } else {
    filterSql = "bchap.book_id = $1";
    filterId = id;
  }

  const countResult = await pool2.query(
    `
    SELECT COUNT(*)::int AS total
    FROM book_chapters bchap
    JOIN book_chunks bchunk ON bchap.id = bchunk.chapter_id
    JOIN memory_cards mc ON bchunk.id = mc.chunk_id
    WHERE ${filterSql}
      AND (
        $2 = ''
        OR mc.question ILIKE $3
        OR mc.answer ILIKE $3
        OR mc.keypoint ILIKE $3
      )
    `,
    [filterId, search, pattern],
  );

  const total = countResult.rows[0].total;

  const result = await pool2.query(
    `
    SELECT mc.*
    FROM book_chapters bchap
    JOIN book_chunks bchunk ON bchap.id = bchunk.chapter_id
    JOIN memory_cards mc ON bchunk.id = mc.chunk_id
    WHERE ${filterSql}
      AND (
        $2 = ''
        OR mc.question ILIKE $3
        OR mc.answer ILIKE $3
        OR mc.keypoint ILIKE $3
      )
    ORDER BY bchunk.position, mc.id
    LIMIT $4 OFFSET $5
    `,
    [filterId, search, pattern, limit, offset],
  );

  return {
    items: result.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
});
