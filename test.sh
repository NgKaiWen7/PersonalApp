curl -X POST http://localhost:8080/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer gT0Dgk5SQNKE1J9QFXzd452_p5A8ZAR_Kr5-KrZUCi8" \
  -d '{
    "title": "Test Note",
    "description": "Testing the notes API",
    "category": "test",
    "noteblocks": [
      {
        "position": 0,
        "content": "This is the first block",
        "type": "text",
        "link": ""
      },
      {
        "position": 1,
        "content": "This is the second block",
        "type": "text",
        "link": ""
      }
    ]
  }'
3f54c7a6-024b-4e2a-8369-df8e6ec4ddc5
5e2307ee-68fc-4061-9459-b02a5664fa49
# Get all notes
curl http://localhost:8080/api/notes -H "Authorization: Bearer gT0Dgk5SQNKE1J9QFXzd452_p5A8ZAR_Kr5-KrZUCi8"

curl -X PATCH http://localhost:8080/api/noteblock/ddd597ef-e099-423a-b138-463cdcbdb4a6 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer gT0Dgk5SQNKE1J9QFXzd452_p5A8ZAR_Kr5-KrZUCi8" \
  -d '{
    "link": "https://example.com"
  }'

# Delete the block
curl -X DELETE http://localhost:8080/api/noteblock/ddd597ef-e099-423a-b138-463cdcbdb4a6 \
  -H "Authorization: Bearer gT0Dgk5SQNKE1J9QFXzd452_p5A8ZAR_Kr5-KrZUCi8"
