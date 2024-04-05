import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { MainContext } from "./mainContext";

import LoginPage from "./pages/Login/LoginPage";
import StudentHome from "./pages/StudentHome/StudentHome";
import TeacherHome from "./pages/TeacherHome/TeacherHome";

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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/studentHome" element={<StudentHome />} />
      <Route path="/" element={<TeacherHome />} />
    </Routes>
  );
}

export default App;
