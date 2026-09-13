let nextClientKey = 100;


function fetchTodos() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          date: "2026-09-13",
          todos: [
            {
              clientKey: nextClientKey++, // <-- Direct assignation
              id: 1,
              title: "Workout",
              description: "Chest and shoulders",
              priority: "normal",
              status: "",
            },
            {
              clientKey: nextClientKey++, // <-- Direct assignation
              id: 2,
              title: "Study React",
              description: "Learn useState",
              priority: "high",
              status: "",
            },
          ],
        },
        {
          date: "2026-09-12",
          todos: [
            {
              clientKey: nextClientKey++, // <-- Direct assignation
              id: 3,
              title: "Read",
              description: "Read React documentation",
              priority: "normal",
              status: "done",
            },
          ],
        },
      ]);
    }, 0);
  });
}

function saveTodos(days) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saved todos:", days);
      resolve();
    }, 0);
  });
}

function generateClientKey() {
  return nextClientKey++;
}

export { fetchTodos, saveTodos, generateClientKey };
