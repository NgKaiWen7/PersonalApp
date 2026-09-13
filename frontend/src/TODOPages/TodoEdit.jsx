import { useEffect, useState, useRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import "./TodoEdit.css";

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


function TodoTitle({ title, ref }) {
  return <textarea ref={ref} className="todo-title" defaultValue={title} />;
}

function TodoDescription({ description, ref }) {
  return (
    <textarea
      ref={ref}
      className="todo-description"
      defaultValue={description}
    />
  );
}

function TodoPriority({ priority, ref }) {
  return (
    <select ref={ref} className="todo-priority" defaultValue={priority}>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
      <option value="critical">Critical</option>
    </select>
  );
}

function TodoStatus({ status, ref }) {
  return (
    <label>
      Status
      <input ref={ref} type="checkbox" defaultChecked={status} />
    </label>
  );
}

function TodoRow({ todo, todoRef , onDelete }) {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const priorityRef = useRef(null);
  const statusRef = useRef(null);

  useImperativeHandle(todoRef, () => {
    return {
      getTodo: () => {
        return {
          ...todo,
          title: titleRef.current.value,
          description: descriptionRef.current.value,
          priority: priorityRef.current.value,
          status: statusRef.current.checked,
        };
      }
    };
  });

  return (
    <div className="todo-edit">
      <div className="todo-form">
        <TodoTitle ref={titleRef} title={todo.title} />
        <TodoDescription ref={descriptionRef} description={todo.description} />
        <TodoPriority ref={priorityRef} priority={todo.priority} />
        <TodoStatus ref={statusRef} status={todo.status} />
      </div>
      <button className="delete-btn" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}

function DaySection({ date, todos, appendTodo ,removeTodo}) {
  const todoRefs = useRef({});

  function saveDay() {
    const data = todos.map((todo) => {
      // Access the exposed function from our dictionary of refs
      return todoRefs.current[todo.clientKey].getTodo();
    });
    console.log("Saving data:", data);
    // POST/PUT data here
  }

  function deleteTodo(todo) {
    const itemKey = todo.key ? todo.key : todo.clientKey;

    // Remove it from our refs dictionary to free up memory
    delete todoRefs.current[itemKey];

    // 2. Call the prop function to update the state in TodoDays
    removeTodo(todo);
  }

  function addTodo() {
    appendTodo({
      // 3. MUST add a unique clientKey here!
      clientKey: nextClientKey++, // or Date.now().toString()
      id: null,
      title: "",
      description: "",
      priority: "medium",
      status: false,
    });
  }

  return (
    <section className="day-section">
      <div className="day-header">
        <h2>{date}</h2>
        <button onClick={addTodo}>Add TODO</button>
        <button onClick={saveDay}>Save</button>
      </div>

      <div className="todo-list">
        {todos.map((todo) => {
          // Define the key once to keep the code clean
          const itemKey = todo.clientKey;

          return (
            <TodoRow
              key={itemKey}
              todo={todo}
              onDelete={() => deleteTodo(todo)}
              todoRef={(element) => {
                if (element) {
                  todoRefs.current[itemKey] = element;
                }
              }}
            />
          );
        })}
      </div>
    </section>
  );
}

// 1. Accept a variable/prop to determine how many days to show
function TodoDays({ daysToShow }) {
  const [days, setDays] = useState([]);

  useEffect(() => {
    fetchTodos().then((allDays) => {
      // 2. If daysToShow is 1, filter only today's data
      if (daysToShow === 1) {
        // Get today's date in YYYY-MM-DD format (adjust if your backend uses a different format like DD/MM/YYYY)
        const todayStr = new Date().toISOString().split("T")[0];

        const todayData = allDays.filter((day) => day.date === todayStr);
        setDays(todayData);
      }
      // Optional: If they pass another number (like 3), take only that many days
      else if (daysToShow > 1) {
        setDays(allDays.slice(0, daysToShow));
      }
      // Otherwise, show all fetched days
      else {
        setDays(allDays);
      }
    });
  }, [daysToShow]); // Re-run if daysToShow changes

  // 3. Fixed state mutation in appendTodo
  function appendTodo(date, todo) {
    setDays((prevDays) =>
      prevDays.map((day) => {
        if (day.date === date) {
          // Return a new object with the new todo appended, rather than using .push()
          return { ...day, todos: [...day.todos, todo] };
        }
        return day;
      })
    );
  }
  function removeTodo(date, todoToRemove) {
    setDays((prevDays) =>
      prevDays.map((day) => {
        if (day.date === date) {
          // Find the matching key
          const keyToRemove = todoToRemove.clientKey;

          // Return a new day object with the item filtered out
          return {
            ...day,
            todos: day.todos.filter(t => (t.clientKey) !== keyToRemove)
          };
        }
        return day;
      })
    );
  }
  return (
    <div className="todo-days">
      {days.map((day) => (
        <DaySection
          key={day.date} // This key is perfect!
          date={day.date}
          todos={day.todos}
          appendTodo={(todo) => appendTodo(day.date, todo)}
          removeTodo={(todo) => removeTodo(day.date, todo)}
        />
      ))}
    </div>
  );
}

export default TodoDays;


export { TodoDays };
