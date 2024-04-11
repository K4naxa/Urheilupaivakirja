import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { MainContext } from "./mainContext";

import LoginPage from "./pages/Login/LoginPage";
import StudentHome from "./pages/StudentHome/StudentHome";
import TeacherHome from "./pages/TeacherHome/TeacherHome";
import Register from "./pages/Register/Register";
import RegistrationPage from "./pages/Registration/RegistrationPage";
import Sports from "./pages/sports/Sports";
import Verify from "./pages/Verify/Verify";
import NewJournalEntryPage from "./pages/NewJournalEntry/NewJournalEntryPage";

function App() {
  // get loggedIn from MainContext
  const { loggedIn } = useContext(MainContext);

  if (!loggedIn) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/verify" element={<Verify />} />
      <Route path="/lajit" element={<Sports />} />
      <Route path="/register" element={<Register />} />
      <Route path="/resetPassword" element={<div>Reset Password</div>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/studentHome" element={<StudentHome />} />
      <Route path="/journal_entries/new" element={<NewJournalEntryPage />} />
      <Route path="/" element={<TeacherHome />} />
    </Routes>
  );
}

// TODO 1: Add a new route to the App component that renders a component called ResetPassword.

export default App;
