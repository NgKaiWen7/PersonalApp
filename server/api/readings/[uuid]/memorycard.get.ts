import { pool2 } from "../../../utils/db";
import type { Card, CardsResponse } from "~/shared/types/summarycard";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "uuid");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing memory card deck ID",
    });
  }

  const query = getQuery(event);
  const search = String(query.search ?? "").trim();
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const offset = (page - 1) * limit;
  const pattern = `%${search}%`;

  const result = await pool2.query<Card>(
    `
    SELECT
      id AS uuid,
      raw_text as content,
      card_path as image_path
    FROM chunks
    WHERE chunks.book_id = $1
      AND chunks.card_path IS NOT NULL
      AND chunks.raw_text ILIKE $2
      AND chunks.level > 0
    ORDER BY chunks.level ASC
    LIMIT $3 OFFSET $4
    `,
    [id, pattern, limit, offset],
  );
  const countResult = await pool2.query<{ total: string }>(
    `
    SELECT COUNT(*) AS total
    FROM chunks
    WHERE chunks.book_id = $1
      AND chunks.card_path IS NOT NULL
      AND chunks.raw_text ILIKE $2
    `,
    [id, pattern],
  );

  const total = Number(countResult.rows[0].total);

  const response: CardsResponse = {
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };

  return response;
});
