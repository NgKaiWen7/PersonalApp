import argon2 from "argon2"
import { pool } from "../../server/utils/db.ts"
const username = process.argv[2]
const password = process.argv[3]

if (!username || !password) {
  console.error("Usage: npx tsx scripts/create-user.ts <username> <password>")
  process.exit(1)
}

try {
  const passwordHash = await argon2.hash(password)

  await pool.query(
    `
    INSERT INTO users (username, password_hash)
    VALUES ($1, $2)
    `,
    [username, passwordHash],
  )

  console.log(`User "${username}" created successfully.`)
} finally {
  await pool.end()
}
