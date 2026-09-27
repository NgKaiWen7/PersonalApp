import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Dashboard from "./Dashboard";
import { Workout } from "./WorkoutPages/Workout";
import { Notes } from "./NotePages/Notes";
import { Readings } from "./ReadingPages/Reading";
import Login from "./Login";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="workout" element={<Workout />} />
          <Route path="notes" element={<Notes />} />
          <Route path="readings" element={<Readings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
