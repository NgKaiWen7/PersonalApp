import { randomBytes } from "node:crypto";
import argon2 from "argon2"

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const username = body.username;
  const password = body.password;

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Username and password are required",
    });
  }
  const result = await pool.query(
    `
        SELECT password_hash
        FROM users
        WHERE username = $1
        `,
    [username],
  );

  if (result.rowCount === 0) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid username or password",
    });
  }

  const passwordHash = result.rows[0].password_hash;

  const valid = await VerifyPassword(password, passwordHash);

  if (!valid) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid username or password",
    });
  }

  // Authentication succeeded.
  const token = randomBytes(32).toString("base64url");

  await pool.query(
    `
        UPDATE users
        SET token = $1,
            validated_date = NOW()
        WHERE username = $2
        `,
    [token, username],
  );

  setCookie(event, "session", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
  })

  return {
    success: true,
  };
});
export async function VerifyPassword(
  password: string,
  encodedHash: string,
): Promise<boolean> {
  try {
    return await argon2.verify(encodedHash, password);
  } catch {
    throw new Error("invalid password hash format");
  }
}
