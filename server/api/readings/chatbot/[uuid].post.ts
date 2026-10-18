export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { chat_uuid, book_uuid, role, content } = body;

    const aiResponse = await $fetch<{ answer: string }>(
        "http://192.168.0.180:8000/ingestion/book_chat",
        {
            method: "POST",
            query: {
                question: content,
                book_id: book_uuid,
            },
        },
    );

    await pool.query(
        `
        INSERT INTO messages (conversation_id, role, content)
        VALUES
            ($1, $2, $3),
            ($1, 'assistant', $4)
        `,
        [chat_uuid, role, content, aiResponse],
    );

    return aiResponse;
});

// CREATE TABLE messages (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     conversation_id UUID NOT NULL
//         REFERENCES conversations(id) ON DELETE CASCADE,
//     role TEXT,
//     content TEXT,
//     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );
