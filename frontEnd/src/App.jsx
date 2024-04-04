import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { MainContext } from "./mainContext";

import LoginPage from "./pages/LoginPage";
import StudentHome from "./pages/StudentHome";
import TeacherHome from "./pages/TeacherHome";

function App() {
  // get loggedIn from MainContext
  const { loggedIn } = useContext(MainContext);

  if (!loggedIn) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/studentHome" element={<StudentHome />} />
      <Route path="/teacherHome" element={<TeacherHome />} />
    </Routes>
  );
}

export default App;
