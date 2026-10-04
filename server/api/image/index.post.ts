import { mkdir, writeFile } from "node:fs/promises";

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);
  if (!form) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid multipart form data",
    });
  }
  const image = form.find((item) => item.name === "image");
  const noteId = form.find((item) => item.name === "note_id");

  if (!image?.data) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing image",
    });
  }

  if (!noteId?.data) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing note ID",
    });
  }

  const noteUuid = noteId.data.toString();

  // Make sure the note exists
  const noteResult = await pool.query(`SELECT id FROM notes WHERE id = $1`, [
    noteUuid,
  ]);

  if (noteResult.rows.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Note not found",
    });
  }

  // Only allow images
  if (!image.type?.startsWith("image/")) {
    throw createError({
      statusCode: 400,
      statusMessage: "File must be an image",
    });
  }

  const imageId = crypto.randomUUID();

  const extension = image.type.split("/")[1] || "bin";

  const storageDir = `/data/images`;
  const filename = `${imageId}.${extension}`;
  const storagePath = `${storageDir}/${filename}`;

  await mkdir(storageDir, {
    recursive: true,
  });

  await writeFile(storagePath, image.data);

  const result = await pool.query(
    `
        INSERT INTO images (
            id,
            filename,
            mime_type,
            storage_path,
            file_size
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id,
            filename,
            mime_type,
            storage_path,
            file_size,
            created_at
        `,
    [
      imageId,
      image.filename ?? filename,
      image.type,
      storagePath,
      image.data.length,
    ],
  );

  await pool.query(
    `
        INSERT INTO note_images (
            note_id,
            image_id
        )
        VALUES ($1, $2)
        `,
    [noteUuid, imageId],
  );

  return result.rows[0];
});
