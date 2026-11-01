import { pool2 } from "../../../utils/db";
import type { Card, CardsResponse } from "#shared/types/card";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "uuid");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing book or chapter UUID",
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
      cards.id AS uuid,
      cards.title,
      cards.content,
      cards.image_path
    FROM cards
    JOIN card_decks
      ON cards.deck_id = card_decks.id
    WHERE card_decks.source_id = $1
      AND cards.image_path IS NOT NULL
      AND (
        cards.title ILIKE $2
        OR cards.content ILIKE $2
      )
    ORDER BY cards.title ASC, cards.id ASC
    LIMIT $3 OFFSET $4
    `,
    [id, pattern, limit, offset],
  );

  const countResult = await pool2.query<{ total: string }>(
    `
    SELECT COUNT(*) AS total
    FROM cards
    JOIN card_decks
      ON cards.deck_id = card_decks.id
    WHERE card_decks.source_id = $1
      AND cards.image_path IS NOT NULL
      AND (
        cards.title ILIKE $2
        OR cards.content ILIKE $2
      )
    `,
    [id, pattern],
  );

  const total = Number(countResult.rows[0].total);

  return {
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
});
