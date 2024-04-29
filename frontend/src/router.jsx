import { createBrowserRouter } from "react-router-dom";

import StudentRoute from "./components/StudentRoute";
import TeacherRoute from "./components/TeacherRoute";

import { AuthLayout } from "./layouts/auth-layout/AuthLayout";

//student
import StudentLayout from "./layouts/student-layout/StudentLayout";
import StudentHome from "./pages/student/student-home/StudentHome";
import NewJournalEntryPage from "./pages/student/journal-entry/new/NewJournalEntryPage";
import EditJournalEntryPage from "./pages/student/journal-entry/edit/EditJournalEntryPage";
import StudentNewsPage from "./pages/student/news/StudentNewsPage";

//teacher
import TeacherLayout from "./layouts/teacher-layout/TeacherLayout";
import TeacherHome from "./pages/teacher/teacher-home/TeacherHome";
import Verify from "./pages/teacher/verify/Verify";

import ManageLayout from "./layouts/manage-layout/ManageLayout";
import SportsPage from "./pages/teacher/manage/sports/SportsPage";
import Visitors from "./pages/teacher/manage/visitors/VisitorsPage";
import SportsPageV2 from "./pages/teacher/manage/sports-v2/SportsPage-v2";
import GroupsPage from "./pages/teacher/manage/student-groups/groupsPage";
import CampusPage from "./pages/teacher/manage/campuses/campusPage";

import ManageStudentsLayout from "./layouts/manageStudents-layout/manageStudentsLayout";
import ManageActiveStudentsPage from "./pages/teacher/manage/students/activeStudents/ManageActiveStudentsPage";
import ManageArchivedStudentsPage from "./pages/teacher/manage/students/archivedStudents/ManageArchivedStudentsPage";
//misc
import NoPage from "./pages/NoPage";
import LoginPage from "./pages/login/LoginPage";
import RegistrationPage from "./pages/registration/RegistrationPage";

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
              }
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
                  { path: "lajit-v2", element: <SportsPageV2 /> },
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
