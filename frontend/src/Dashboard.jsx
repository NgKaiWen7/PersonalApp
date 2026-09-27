import { Aim } from "./AimPages/Aim.jsx";
import { TodoDashboard } from "./TODOPages/Todo.jsx";

export function Dashboard() {
  return (
    <>
      <TodoDashboard />
      <Aim />
    </>
  );
}
