import { createBrowserRouter } from "react-router-dom";

import StudentRoute from "./components/StudentRoute";
import TeacherRoute from "./components/TeacherRoute";

import { AuthLayout } from "./layouts/auth-layout/AuthLayout";

import NewJournalEntryPage from "./pages/student/new-journal-entry/NewJournalEntryPage";
import StudentLayout from "./layouts/student-layout/StudentLayout";
import StudentHome from "./pages/student/student-home/StudentHome";
import TeacherLayout from "./layouts/teacher-layout/TeacherLayout";
import TeacherHome from "./pages/teacher/teacher-home/TeacherHome";
import LoginPage from "./pages/login/LoginPage";
import RegistrationPage from "./pages/registration/RegistrationPage";
import Verify from "./pages/teacher/verify/Verify";
import SportsPage from "./pages/teacher/manage/sports/SportsPage";
import ManageLayout from "./layouts/manage-layout/ManageLayout";
import Visitors from "./pages/teacher/manage/visitors/VisitorsPage";
import SportsPageV2 from "./pages/teacher/manage/sports-v2/SportsPage-v2";
import GroupsPage from "./pages/teacher/manage/student-groups/groupsPage";
import NoPage from "./pages/NoPage";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        errorElement: <h1>Virhettä pukkaa</h1>,
        children: [
          {
            path: "/",
            element: (
              <StudentRoute>
                <StudentLayout />
              </StudentRoute>
            ),
            children: [{ index: true, element: <StudentHome /> }],
          },
          {
            path: "merkinnat/uusi",
            element: (
              <StudentRoute>
                <NewJournalEntryPage />
              </StudentRoute>
            ),
          },

          { path: "/kirjaudu", element: <LoginPage /> },
          { path: "/rekisteroidy", element: <RegistrationPage /> },
          {
            path: "/opettaja",
            element: (
              <TeacherRoute>
                <TeacherLayout />
              </TeacherRoute>
            ),
            children: [
              { index: true, element: <TeacherHome /> },
              { path: "hyvaksy", element: <Verify /> },
              {
                path: "hallitse",
                element: <ManageLayout />,
                children: [
                  { path: "lajit", element: <SportsPage /> },
                  { path: "lajit-v2", element: <SportsPageV2 /> },
                  { path: "vierailijat", element: <Visitors /> },
                  { path: "ryhmat", element: <GroupsPage /> },
                ],
              },
            ],
          },
        ],
      },
      { path: "*", element: <NoPage /> },
    ],
  },
]);