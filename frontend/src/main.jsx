import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard.jsx";
import { ReadingList } from "./ReadingPages/ReadingList.jsx";
import { Notes } from "./NotePages/Notes.jsx";
import WorkoutEdit from "./WorkoutPages/WorkoutEdit";
import TodoDays from "./TODOPages/TodoEdit.jsx";
import { AuthProvider } from "./AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/readings" element={<ReadingList />} />
          <Route path="/todo" element={<TodoDays />} />
          <Route path="/workout" element={<WorkoutEdit />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>,
);
