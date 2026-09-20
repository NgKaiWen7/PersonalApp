let nextClientKey = 100;

function getDatesInRange(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`); // "YYYY-MM-DD" in local time

    current.setDate(current.getDate() + 1);
  }

  return dates;
}

async function fetchTodos(startDate, endDate) {
  const dates = getDatesInRange(startDate, endDate); // assumed to be YYYY-MM-DD strings
  const token = localStorage.getItem("app_token");
  console.log(token);
  const response = await fetch(
    `https://backend.nkwzotero.uk/api/todos?dates=${dates.join(",")}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch todos: ${errorText}`);
  }
  const days = await response.json();
  var return_format = {};
  dates.forEach((date, index) => {
    if (days[date]) {
      return_format[date] = days[date]
    } else {
      return_format[date] = {"date":date, "title": "", "description": ""}
    }
  })
  return return_format;
}

async function saveTodos(date, description, title) {
  const payload = {
    date: date,
    description: description,
    title: title,
  };
  const token = localStorage.getItem("app_token");

  const response = await fetch("https://backend.nkwzotero.uk/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to save todos for ${date} (${response.status}): ${errorText}`,
    );
  }
  return await response.json();
}

function generateClientKey() {
  return nextClientKey++;
}

export { fetchTodos, saveTodos, generateClientKey };
