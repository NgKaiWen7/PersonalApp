import { pool2 } from "../../../utils/db";
import { createReadStream, existsSync, statSync } from "node:fs";
import { basename, resolve, sep } from "node:path";
import { sendStream } from "h3";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "uuid");
  console.log(id)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Book UUID is required",
    });
  }

  const result = await pool2.query<{ source: string }>(
    `
    SELECT source
    FROM books
    WHERE id = $1
    `,
    [id],
  );

  const book = result.rows[0];

  if (!book?.source) {
    throw createError({
      statusCode: 404,
      statusMessage: "Book file not found",
    });
  }

  const filePath = resolve(book.source);
  const dataDir = resolve("/data");

  if (
    filePath !== dataDir &&
    !filePath.startsWith(dataDir + sep)
  ) {
    throw createError({
      statusCode: 403,
      statusMessage: "Invalid file path",
    });
  }
  console.log(filePath)
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    throw createError({
      statusCode: 404,
      statusMessage: "Book file not found",
    });
  }

  const extension = basename(filePath)
    .split(".")
    .pop()
    ?.toLowerCase();

  const contentType =
    extension === "epub"
      ? "application/epub+zip"
      : extension === "pdf"
        ? "application/pdf"
        : "application/octet-stream";

  setResponseHeader(event, "Content-Type", contentType);
  setResponseHeader(event, "Content-Disposition", "inline");
  setResponseHeader(event, "Content-Length", statSync(filePath).size);
  setResponseHeader(event, "X-Content-Type-Options", "nosniff");
  return sendStream(event, createReadStream(filePath));
});
