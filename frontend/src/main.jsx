import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import WorkoutEdit from "./WorkoutPages/WorkoutEdit";
import TodoDays from "./TODOPages/TodoEdit.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/todo/edit" element={<TodoDays />} />
      <Route path="/workout/edit" element={<WorkoutEdit />} />
    </Routes>
  </BrowserRouter>
);
