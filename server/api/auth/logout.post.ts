import { deleteCookie, getCookie, defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "session");

  if (token) {
    await pool.query(
      `
            UPDATE users
            SET token = NULL
            WHERE token = $1
            `,
      [token],
    );
  }
  deleteCookie(event, "session", { path: "/" });
  return { success: true };
});
