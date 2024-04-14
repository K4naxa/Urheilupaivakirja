import "./app.css";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { mainContext } from "./context/mainContext";

import LoginPage from "./pages/login/LoginPage";
import StudentHome from "./pages/student-home/StudentHome";
import TeacherHome from "./pages/teacher-home/TeacherHome";
import RegistrationPage from "./pages/registration/RegistrationPage";
import Sports from "./pages/sports/SportsPage";
import Verify from "./pages/verify/Verify";
import NewJournalEntryPage from "./pages/new-journal-entry/NewJournalEntryPage";

function App() {
  // get loggedIn from mainContext
  const { loggedIn } = useContext(mainContext);

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
