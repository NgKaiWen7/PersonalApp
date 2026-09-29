const noteUrl = "https://backend.nkwzotero.uk/api/notes";
const blockUrl = "https://backend.nkwzotero.uk/api/noteblock";

async function getLimitedNotes({ page }) {
  const token = localStorage.getItem("app_token");
  const url = noteUrl + "?page=" + page;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to get readings");
  }
  const data = await response.json();
  return data ?? [];
}
async function getFullNotes({ id }) {
  const token = localStorage.getItem("app_token");
  const url = noteUrl + "/" + id;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to get readings");
  }
  const data = await response.json();
  return data;
}

async function saveNewNote({ notes }) {
  const token = localStorage.getItem("app_token");

  const response = await fetch(noteUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notes),
  });

  if (!response.ok) {
    throw new Error("Failed to save note");
  }

  const data = await response.json();
  return data.id;
}
async function createNewBlocks({ block }) {
  const token = localStorage.getItem("app_token");
  const response = await fetch(blockUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(block),
  });
  if (!response.ok) {
    console.log(response.text())
    throw new Error("Failed to save block");
  }
  const data = await response.json();
  return data.id;
}

export { getLimitedNotes, getFullNotes, saveNewNote, createNewBlocks };
