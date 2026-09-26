const backendUrl = "https://backend.nkwzotero.uk/api/readings";

async function loadReadings() {
  const token = localStorage.getItem("app_token");
  const response = await fetch(backendUrl, {
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

async function addReadings(file) {
  const token = localStorage.getItem("app_token");
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(backendUrl, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed upload readings");
  }
  var file_id = response.text();
  return file_id;
}
async function deleteReadings(id) {
  const token = localStorage.getItem("app_token");
  var url = backendUrl + "/" + id
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete readings");
  }
  return response.text()
}
async function getReadingFile(id) {
  const token = localStorage.getItem("app_token");
  var url = backendUrl + "/" + id
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete readings");
  }
  return await response.blob();
}

export { loadReadings, addReadings , deleteReadings, getReadingFile};
