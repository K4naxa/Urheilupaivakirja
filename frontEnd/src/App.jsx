import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { MainContext } from "./mainContext";

import LoginPage from "./pages/Login/LoginPage";
import StudentHome from "./pages/StudentHome/StudentHome";
import TeacherHome from "./pages/TeacherHome/TeacherHome";
import Register from "./pages/Register/Register";

function App() {
  // get loggedIn from MainContext
  const { loggedIn, userRole } = useContext(MainContext);

  if (!loggedIn) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/resetPassword" element={<div>Reset Password</div>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/studentHome" element={<StudentHome />} />
      <Route path="/" element={<TeacherHome />} />
    </Routes>
  );
}

// TODO 1: Add a new route to the App component that renders a component called ResetPassword.

export default App;
