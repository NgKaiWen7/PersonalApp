import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { Login } from "./Login";
import WorkoutEdit from "./WorkoutPages/WorkoutEdit";
import TodoDays from "./TODOPages/TodoEdit.jsx";
import { AuthProvider } from "./AuthContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {" "}
    <AuthProvider>
      {" "}
      <Routes>
        {" "}
        <Route path="/" element={<App />} />{" "}
        <Route path="/login" element={<Login />} />{" "}
        <Route path="/todo/edit" element={<TodoDays />} />{" "}
        <Route path="/workout/edit" element={<WorkoutEdit />} />{" "}
      </Routes>{" "}
    </AuthProvider>{" "}
  </BrowserRouter>,
);
