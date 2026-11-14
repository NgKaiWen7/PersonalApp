import { pool2 } from "../../utils/db";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { createHash } from "node:crypto";

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event);

  if (!parts) {
    throw createError({
      statusCode: 400,
      statusMessage: "Multipart form data is required",
    });
  }

  const getField = (name: string) =>
    parts.find((part) => part.name === name && !part.filename)?.data.toString();

  const title = getField("title");
  const category = getField("category");
  const status = getField("status");
  const lastRead = getField("last_read");
  const description = getField("description");
  const orifilename = getField("filename");

  if (!title) {
    throw createError({
      statusCode: 400,
      statusMessage: "Title is required",
    });
  }

  const file = parts.find((part) => part.name === "file" && part.filename);

  let source: string | null = null;
  if (file) {
    const uploadDir = "/data";
    await mkdir(uploadDir, { recursive: true });
    const extension = extname(orifilename ?? file.filename ?? "");

    const filename =
      createHash("md5").update(file.data).digest("hex") + extension;
    const filePath = join(uploadDir, filename);

    await writeFile(filePath, file.data);
    source = filePath;
  }
  const result = await pool2.query<{ id: string; source: string }>(
    `
    INSERT INTO books (
      title,
      category,
      status,
      last_read,
      description,
      source
    )
    VALUES ($1, $2::text[], $3, $4, $5, $6)
    RETURNING
      id,
      title,
      category,
      status,
      last_read,
      description,
      source,
      created_at
    `,
    [
      title,
      category ? [category] : [],
      status || "Want to Read",
      lastRead || null,
      description || "",
      source,
    ],
  );

  setResponseStatus(event, 201);

  return result.rows[0];
});
