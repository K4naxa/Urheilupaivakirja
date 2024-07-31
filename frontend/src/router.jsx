import { createBrowserRouter } from "react-router-dom";

import StudentRoute from "./components/StudentRoute";
import TeacherRoute from "./components/TeacherRoute";

import { AuthLayout } from "./layouts/auth-layout/AuthLayout";
import RedirectIfAuthenticated from "./components/redirect/RedirectIfAuthenticated";
import RedirectIfNotAuthenticated from "./components/redirect/RedirectIfNotAuthenticated";

//student
import StudentLayout from "./layouts/StudentLayout";
import StudentHome from "./pages/student/StudentHome";
import NewJournalEntryPage from "./pages/student/journal-entry/NewJournalEntryPage";
import EditJournalEntryPage from "./pages/student/journal-entry/EditJournalEntryPage";
import StudentNewsPage from "./pages/student/StudentNewsPage";

// Visitor
import VisitorRegistrationPage from "./pages/VisitorRegistrationPage";

//teacher
import TeacherLayout from "./layouts/TeacherLayout";
import TeacherHome from "./pages/teacher/TeacherHome";
import Verify from "./pages/teacher/verify/Verify";

import StudentPage from "./pages/teacher/Studentpage";

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
import TestPage from "./pages/testPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgottenPasswordConfirmPage from "./pages/misc/forgotten-password/ForgottenPasswordConfirmPage";
import ForgottenPasswordPage from "./pages/misc/forgotten-password/ForgottenPasswordPage";
import ForgottenPasswordNewPasswordPage from "./pages/misc/forgotten-password/ForgottenPasswordNewPasswordPage";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import StudentTrophyPage from "./pages/student/StudentTrophyPage";
import TeacherProfilePage from "./pages/teacher/TeacherProfilePage";
import TeacherNewsPage from "./pages/teacher/TeacherNewsPage";
import StatisticsPage from "./pages/teacher/StatisticsPage";
import VisitorLayout from "./layouts/VisitorLayout";
import VisitorProfilePage from "./pages/visitor/VisistorProfilePage";

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
                path: "saavutukset",
                element: <StudentTrophyPage />,
              },
              {
                path: "tiedotteet",
                element: <StudentNewsPage />,
              },
              {
                path: "profiili",
                element: <StudentProfilePage />,
              },
            ],
          },

          {
            path: "/kirjaudu",
            element: (
              <RedirectIfAuthenticated>
                <LoginPage />
              </RedirectIfAuthenticated>
            ),
          },
          { path: "/test", element: <TestPage /> },
          {
            path: "/rekisteroidy",
            element: (
              <RedirectIfAuthenticated>
                <RegistrationPage />
              </RedirectIfAuthenticated>
            ),
          },
          {
            path: "/vierailijan-rekisterointi",
            element: <VisitorRegistrationPage />,
          },
          {
            path: "/unohditko-salasanasi",
            element: (
              <RedirectIfAuthenticated>
                <ForgottenPasswordPage />
              </RedirectIfAuthenticated>
            ),
          },
          {
            path: "/unohditko-salasanasi/vahvista",
            element: (
              <RedirectIfAuthenticated>
                <ForgottenPasswordConfirmPage />
              </RedirectIfAuthenticated>
            ),
          },
          {
            path: "/unohditko-salasanasi/uusi-salasana",
            element: (
              <RedirectIfAuthenticated>
                <ForgottenPasswordNewPasswordPage />
              </RedirectIfAuthenticated>
            ),
          },
          {
            path: "/vahvista-sahkoposti",
            element: (
              <RedirectIfNotAuthenticated>
                <EmailVerificationPage />
              </RedirectIfNotAuthenticated>
            ),
          },
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
              { path: "opiskelijat/:id", element: <StudentPage /> },
              { path: "profiili", element: <TeacherProfilePage /> },
              { path: "tiedotteet", element: <TeacherNewsPage /> },
              { path: "tilastot", element: <StatisticsPage /> },

              {
                path: "hallitse",
                element: <ManageLayout />,
                children: [
                  { element: <SportsPage />, index: true },
                  { path: "vierailijat", element: <Visitors /> },
                  { path: "ryhmat", element: <GroupsPage /> },
                  { path: "toimipaikat", element: <CampusPage /> },
                  {
                    path: "opiskelijat/",
                    element: <ManageStudentsLayout />,
                    children: [
                      {
                        index: true,
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
          {
            path: "/vierailija",
            element: <VisitorLayout />,
            children: [
              { index: true, element: <TeacherHome /> },
              { path: "tilastot", element: <StatisticsPage /> },
              { path: "opiskelijat/:id", element: <StudentPage /> },
              { path: "profiili", element: <VisitorProfilePage /> },
            ],
          },
        ],
      },
      { path: "*", element: <NoPage /> },
    ],
  },
]);
