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
  const response = await fetch(
    `https://backend.nkwzotero.uk/api/todos?dates=${dates.join(",")}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch todos: ${errorText}`);
  }

  const days = await response.json();

  // Normalize any date string/timestamp down to YYYY-MM-DD for matching
  const toDateKey = (d) => new Date(d).toISOString().slice(0, 10);

  const daysByDate = new Map(days.map((day) => [toDateKey(day.date), day]));

  return dates.map((date) => {
    const day = daysByDate.get(toDateKey(date)) ?? { date, tasks: [] };
    return {
      ...day,
      date, // keep the original YYYY-MM-DD from `dates` for consistency in the frontend
      tasks: (day.tasks ?? []).map((task) => ({
        ...task,
        clientKey: generateClientKey(),
      })),
    };
  });
}

async function saveTodos(days) {
  const results = [];

  for (const day of days) {
    const payload = {
      date: day.date,
      tasks: day.todos.map((todo) => ({
        title: todo.title,
        description: todo.description,
        status: todo.status,
      })),
    };

    const response = await fetch("https://backend.nkwzotero.uk/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to save todos for ${day.date} (${response.status}): ${errorText}`
      );
    }

    results.push(await response.json());
  }

  return results;
}

function generateClientKey() {
  return nextClientKey++;
}

export { fetchTodos, saveTodos, generateClientKey };
