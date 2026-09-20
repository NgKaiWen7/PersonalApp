import {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import "./TodoEdit.css";
import { fetchTodos, saveTodos, generateClientKey } from "./TodoData.jsx";
const DAYS_BACK_DEFAULT = 7;
const DAYS_FORWARD_DEFAULT = 7;
const LOAD_MORE_CHUNK = 7; // how many extra days to fetch each time we scroll near the bottom

function getTodayDate() {
  const now = new Date();
  const utc8 = new Date(
    now.getTime() + (8 * 60 + now.getTimezoneOffset()) * 60 * 1000,
  );
  const year = utc8.getFullYear();
  const month = String(utc8.getMonth() + 1).padStart(2, "0");
  const day = String(utc8.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // e.g. "2026-09-13"
}
function resizeToContent(el) {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

function TodoTitle({ title, ref }) {
  return <textarea ref={ref} className="todo-title" defaultValue={title} />;
}

function TodoDescription({ description, ref }) {
  useEffect(() => {
    if (ref?.current) resizeToContent(ref.current);
  }, []);

  return (
    <textarea
      ref={ref}
      className="todo-description"
      defaultValue={description}
      onInput={(e) => resizeToContent(e.target)}
      rows={1}
    />
  );
}

function DaySection({ date, title, description }) {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  async function saveDay() {
    await saveTodos(date, descriptionRef.current.value, titleRef.current.value);
  }

  const isToday = date === getTodayDate();
  const [isOpen, setIsOpen] = useState(isToday);
  return (
    <section className={`day-section${isToday ? " glowing" : ""}`}>
      <div
        className="day-header"
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((o) => !o);
          }
        }}
      >
        <h2>{date}</h2>
        {isToday && <span className="today-badge">Today</span>}
        <button
          className="save-btn"
          onClick={(e) => {
            e.stopPropagation();
            saveDay();
          }}
        >
          Save
        </button>
      </div>
      <div className={`todo-list${isOpen ? "" : " collapsed"}`}>
        <TodoTitle ref={titleRef} title={title} />
        <TodoDescription ref={descriptionRef} description={description} />
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
  return (
    <div className="todo-days">
      {Object.entries(days).map(([index, day]) => (
        <DaySection
          key={index}
          date={day.date}
          title={day.title}
          description={day.description}
        />
      ))}
    </div>
  );
}

export default TodoDays;
