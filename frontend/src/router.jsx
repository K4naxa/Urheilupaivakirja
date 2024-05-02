import { createBrowserRouter } from "react-router-dom";
import { ToastProvider } from "./hooks/toast-messages/ToastProvider";

import StudentRoute from "./components/StudentRoute";
import TeacherRoute from "./components/TeacherRoute";

import { AuthLayout } from "./layouts/auth-layout/AuthLayout";

//student
import StudentLayout from "./layouts/StudentLayout";
import StudentHome from "./pages/student/student-home/StudentHome";
import NewJournalEntryPage from "./pages/student/journal-entry/new/NewJournalEntryPage";
import EditJournalEntryPage from "./pages/student/journal-entry/edit/EditJournalEntryPage";
import StudentNewsPage from "./pages/student/news/StudentNewsPage";

//teacher
import TeacherLayout from "./layouts/TeacherLayout";
import TeacherHome from "./pages/teacher/TeacherHome";
import Verify from "./pages/teacher/verify/Verify";

import ManageLayout from "./layouts/manage-layout/ManageLayout";
import SportsPage from "./pages/teacher/manage/SportsPage";
import Visitors from "./pages/teacher/manage/VisitorsPage";
import GroupsPage from "./pages/teacher/manage/groupsPage";
import CampusPage from "./pages/teacher/manage/campusPage";

import ManageStudentsLayout from "./layouts/manage-layout/manageStudentsLayout";
import ManageActiveStudentsPage from "./pages/teacher/manage/students/ManageActiveStudentsPage";
import ManageArchivedStudentsPage from "./pages/teacher/manage/students/ManageArchivedStudentsPage";
//misc
import NoPage from "./pages/NoPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";

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
            children: [
              { index: true, element: <StudentHome /> },
              { path: "merkinnat/uusi", element: <NewJournalEntryPage /> },
              {
                path: "merkinnat/muokkaa/:entry_id",
                element: <EditJournalEntryPage />,
              },
              {
                path: "tiedotteet",
                element: <StudentNewsPage />,
              },
            ],
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
                  { path: "vierailijat", element: <Visitors /> },
                  { path: "ryhmat", element: <GroupsPage /> },
                  { path: "toimipaikat", element: <CampusPage /> },
                  {
                    path: "opiskelijat",
                    element: <ManageStudentsLayout />,
                    children: [
                      {
                        index: true, // Set ManageActiveStudentsPage as default
                        element: <ManageActiveStudentsPage />,
                      },
                      {
                        path: "arkistoidut",
                        element: <ManageArchivedStudentsPage />,
                      },
                    ],
                  },
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
