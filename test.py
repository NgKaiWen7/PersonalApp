import sys

import pymupdf
import requests

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "phi4-mini:latest"


def read_pdf(pdf_path):
    doc = pymupdf.open(pdf_path)

    pages = []

    for page_number, page in enumerate(doc, start=1):
        if page_number > 9:
            break
        text = page.get_text()

        if text.strip():
            pages.append(f"\n--- Page {page_number} ---\n{text.strip()}")

    doc.close()

    return "\n".join(pages)


def ask_ollama(pdf_text, question):
    system_prompt = """You are a document question-answering assistant.

Your task is to answer questions using ONLY the contents of the provided document.

Rules:
1. Do not use outside knowledge to answer the question.
2. Do not invent, assume, or infer facts that are not supported by the document.
3. If the document does not contain enough information to answer the question, clearly say so.
4. When answering, identify the relevant page number when possible.
5. If the document contains conflicting information, explicitly point out the conflict instead of choosing one without explanation.
6. Preserve important names, numbers, dates, amounts, and technical terms exactly as they appear in the document.
7. Answer the user's question directly and concisely.
"""

    user_prompt = f"""Here is the document you must use as your source.

<DOCUMENT>
{pdf_text}
</DOCUMENT>

Answer the following question using only the document:

<QUESTION>
{question}
</QUESTION>
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
            "stream": True,
        },
        stream=True,
        timeout=300,
    )

    response.raise_for_status()

    for line in response.iter_lines():
        if line:
            data = line.decode("utf-8")

            import json
            chunk = json.loads(data)

            content = chunk.get("message", {}).get("content", "")

            if content:
                print(content, end="", flush=True)

    print('\n')

def main():
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <pdf>")
        sys.exit(1)

    pdf_path = sys.argv[1]

    print(f"Reading: {pdf_path}")

    try:
        pdf_text = read_pdf(pdf_path)
    except Exception as e:
        print(f"Failed to read PDF: {e}")
        sys.exit(1)

    if not pdf_text.strip():
        print("No text could be extracted from the PDF.")
        sys.exit(1)
    print(f"Extracted {len(pdf_text):,} characters.")
    print()
    print("PDF loaded. Ask questions.")
    print("Type 'exit' or 'quit' to stop.")
    print()

    while True:
        try:
            question = input("You: ").strip()
        except (KeyboardInterrupt, EOFError):
            print()
            break

        if not question:
            continue

        if question.lower() in ("exit", "quit"):
            break

        try:
            answer = ask_ollama(pdf_text, question)

            print()
            print("Phi-4:")
            print(answer)
            print()

        except requests.RequestException as e:
            print(f"Ollama request failed: {e}")
            print()


if __name__ == "__main__":
    main()
