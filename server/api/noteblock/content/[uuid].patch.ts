export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, "uuid");
  const body = await readBody(event)
  const result = await pool.query(
    `
      UPDATE note_blocks nb
      SET content = $2
      WHERE nb.id = $1
    `,
    [uuid, body],
  );
  return result;
});
