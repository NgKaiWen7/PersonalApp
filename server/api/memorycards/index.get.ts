import { pool2 } from "../../utils/db";

type MemorycardDeck = {
  id: string;
  source_id: string | null;
  title: string | null;
  created_at: string | null;
};

export default defineEventHandler(async () => {
  const result = await pool2.query<MemorycardDeck>(
    `
    SELECT id, source_id, title, created_at
    FROM card_decks
    ORDER BY created_at DESC NULLS LAST, title ASC
    `,
  );

  return result.rows;
});
