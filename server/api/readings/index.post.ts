import { pool2 } from "../../utils/db";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";

export default defineEventHandler(async (event) => {
  console.log("hi")
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
  const description = getField("description");

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

    const filename = createHash("md5")
      .update(file.data)
      .digest("hex");
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
      description,
      source
    )
    VALUES ($1, $2::text[], $3, $4, $5)
    RETURNING id, source
    `,
    [
      title,
      category ? [category] : [],
      status || "Want to Read",
      description || "",
      source,
    ],
  );

  setResponseStatus(event, 201);

  return result.rows[0];
});
