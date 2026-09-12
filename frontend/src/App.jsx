import { Todo } from "./Todo";
import { Workout } from "./Workout";
import "./Header.css";

export function Header() {
  return (
    <header className="app-header">
      <h1>My Productivity App</h1>
      <p>Organize your day. Get things done.</p>
    </header>
  );
}
export default function App() {
  return (
    <div className="app-container">
      <Header />

      <main className="content">
        <Todo />
        <Workout />
      </main>
    </div>
  );
}
