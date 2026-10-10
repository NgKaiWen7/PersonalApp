import { pool2 } from "../../utils/db";
import { unlink } from "node:fs/promises";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "uuid");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Book ID is required",
    });
  }

  const client = await pool2.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query<{ source: string | null }>(
      `
      DELETE FROM books
      WHERE id = $1
      RETURNING source
      `,
      [id],
    );

    if (result.rowCount === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Book not found",
      });
    }

    const source = result.rows[0].source;

    if (source) {
      try {
        await unlink(source);
      } catch (error: any) {
        if (error.code !== "ENOENT") {
          throw error;
        }
      }
    }

    await client.query("COMMIT");

    setResponseStatus(event, 200);
    return { success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});
