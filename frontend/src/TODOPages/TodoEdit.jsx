import { useEffect, useState, useRef, useImperativeHandle , useCallback} from "react";
import { useNavigate } from "react-router-dom";
import "./TodoEdit.css";
import {  fetchTodos, saveTodos, generateClientKey } from "./TodoData.jsx";
const DAYS_BACK_DEFAULT = 7;
const DAYS_FORWARD_DEFAULT = 7;
const LOAD_MORE_CHUNK = 7; // how many extra days to fetch each time we scroll near the bottom



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

function TodoStatus({ status, ref }) {
  return (
    <label>
      Status
      <input ref={ref} type="checkbox" defaultChecked={status} />
    </label>
  );
}

function TodoRow({ todo, todoRef, onDelete }) {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const statusRef = useRef(null);

  useImperativeHandle(todoRef, () => {
    return {
      getTodo: () => {
        return {
          ...todo,
          title: titleRef.current.value,
          description: descriptionRef.current.value,
          status: statusRef.current.checked,
        };
      },
    };
  });

  return (
    <div className="todo-edit">
      <div className="todo-form">
        <TodoTitle ref={titleRef} title={todo.title} />
        <TodoDescription ref={descriptionRef} description={todo.description} />
        <TodoStatus ref={statusRef} status={todo.status} />
      </div>
      <button className="delete-btn" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}

function DaySection({ date, todos, appendTodo, removeTodo }) {
  const todoRefs = useRef({});

  async function saveDay() {
    const dayTodos = todos.map((todo) => todoRefs.current[todo.clientKey].getTodo());
    await saveTodos([
      {
        date: date,
        todos: dayTodos,
      },
    ]);
  }

  function deleteTodo(todo) {
    const itemKey = todo.clientKey;
    delete todoRefs.current[itemKey];
    removeTodo(todo);
  }

  function addTodo() {
    appendTodo({
      // 3. MUST add a unique clientKey here!
      clientKey: generateClientKey(), // or Date.now().toString()
      id: null,
      title: "",
      description: "",
      status: false,
    });
  }

  return (
    <section className="day-section">
      <div className="day-header">
        <h2>{date}</h2>
        <button onClick={addTodo}>Add TODO</button>
        <button onClick={async () => await saveDay()}>Save</button>
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

function toMidnight(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, n) {
  const d = toMidnight(date);
  d.setDate(d.getDate() + n);
  return d;
}

function TodoDays({ centerDate }) {
  const today = toMidnight(centerDate ? new Date(centerDate) : new Date());

  const [days, setDays] = useState([]);

  // Initial load: 7 days back to 7 days forward
  useEffect(() => {
    let startDate, endDate;

    if (centerDate) {
      // Only load the single specified day.
      startDate = today;
      endDate = today;
    } else {
      startDate = addDays(today, -DAYS_BACK_DEFAULT);
      endDate = addDays(today, DAYS_FORWARD_DEFAULT);
    }
    fetchTodos(startDate, endDate)
      .then(setDays)
      .catch((err) => console.error(err));
  }, []); // re-run only if the "center" the parent passed in changes

  console.log(days);

  function appendTodo(date, todo) {
    setDays((prevDays) =>
      prevDays.map((day) =>
        day.date === date ? { ...day, todos: [...day.todos, todo] } : day
      )
    );
  }

  function removeTodo(date, todoToRemove) {
    setDays((prevDays) =>
      prevDays.map((day) => {
        if (day.date === date) {
          return {
            ...day,
            todos: day.todos.filter((t) => t.clientKey !== todoToRemove.clientKey),
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
          key={day.date}
          date={day.date}
          todos={day.tasks}
          appendTodo={(todo) => appendTodo(day.date, todo)}
          removeTodo={(todo) => removeTodo(day.date, todo)}
        />
      ))}
    </div>
  );
}

export default TodoDays;
