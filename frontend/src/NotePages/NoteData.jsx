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
async function createNewBlocks({ noteID, type }) {
  const token = localStorage.getItem("app_token");
  const response = await fetch(`${blockUrl}/${noteID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type }),
  });
  if (!response.ok) {
    console.log(await response.text());
    throw new Error("Failed to create block");
  }
  const id = await response.text();
  return id;
}
async function orderNoteBlocks({ id, block_list }) {
  const token = localStorage.getItem("app_token");
  const url = `https://backend.nkwzotero.uk/api/reordernotes/${id}`;
  const uuid_list = block_list.map((block) => block.id);
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(uuid_list),
  });

  if (!response.ok) {
    console.log(await response.text());
    throw new Error("Failed to save block");
  }
}
async function deleteNoteBlocks({ id }) {
  const token = localStorage.getItem("app_token");
  const url = `${blockUrl}/${id}`;
  console.log(url);
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to save note");
  }
  const data = await response.json();
  return data.id;
}
async function patchNoteBlocks({ id, content }) {
  const token = localStorage.getItem("app_token");
  const url = `${blockUrl}/${id}`;
  const payload = { content: content };
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    console.log(response.text());
    throw new Error("Failed to save note");
  }
}
async function patchNote({ id, title }) {
  const token = localStorage.getItem("app_token");
  const url = `${noteUrl}/${id}`;
  const payload = { title: title };
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    console.log(await response.text());
    throw new Error("Failed to save note");
  }
}
async function deleteNote({ id }) {
  const token = localStorage.getItem("app_token");
  const url = `${noteUrl}/${id}`;
  console.log(url);
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to save note");
  }
  const data = await response.json();
  return data.id;
}
export {
  getLimitedNotes,
  getFullNotes,
  saveNewNote,
  createNewBlocks,
  orderNoteBlocks,
  deleteNoteBlocks,
  patchNoteBlocks,
  patchNote,
  deleteNote,
};
