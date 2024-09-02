import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/auth/LoginPage.jsx";
import Home from "./pages/dashboard/HomePage.jsx";
import Users from "./pages/dashboard/users/UsersPage.jsx";
import Admin from "./pages/dashboard/admin/AdminPage.jsx";
import Monitoring from "./pages/dashboard/monitors/MonitoringPage.jsx";
import VerifTicket from "./pages/dashboard/Tickets/VerifTicketPage.jsx";
import Tickets from "./pages/dashboard/Tickets/TicketsPage.jsx";
import Settings from "./pages/dashboard/settings/SettingsPage.jsx";

import DashboardLayout from "./pages/layouts/DashboardLayout.jsx";
import UsersDetail from "./pages/dashboard/users/UsersDetail.jsx";
import CreateTicketPage from "./pages/dashboard/Tickets/CreateTicketPage.jsx";
import CreateTicketDetail from "./pages/dashboard/Tickets/CreateTicketDetail.jsx";
import MonitoringTicketDetail from "./pages/dashboard/monitors/MonitoringTicketDetail.jsx";
import UserEditPage from "./pages/dashboard/users/UserEditPage.jsx";
import ProfileSettingPage from "./pages/dashboard/settings/ProfileSettingPage.jsx";
import PasswordSettingPage from "./pages/dashboard/settings/PasswordSettingPage.jsx";
import UpdateSettingPage from "./pages/dashboard/settings/UpdateSettingPage.jsx";
import UpdateDetailSettingPage from "./pages/dashboard/settings/UpdateDetailSettingPage.jsx";
import ComplaintSettingPage from "./pages/dashboard/settings/ComplaintSettingPage.jsx";
import UserProfilePage from "./pages/dashboard/users/UserProfilePage.jsx";
import ComplaintDetailSettingPage from "./pages/dashboard/settings/ComplaintDetailSettingPage.jsx";
import VerifTicketDetail from "./pages/dashboard/Tickets/VerifTicketDetail.jsx";
import AdminProfilePage from "./pages/dashboard/admin/AdminProfilePage.jsx";
import ProtectedRoute from "./pages/auth/ProtectedRoute.jsx";
import AdminEditPage from "./pages/dashboard/admin/AdminEditPage.jsx";
import PickTimer from "./pages/PickTimer.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Home />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Users />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/kelas/:kelasId",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <UsersDetail />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Admin />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/create-tickets",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <CreateTicketPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/create-tickets/c/:nisn/:id/:username",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <CreateTicketDetail />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/verification-ticket",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <VerifTicket />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/verification-ticket/detail/:id",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <VerifTicketDetail />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/user/:id",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <UserProfilePage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/admin/:id",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <AdminProfilePage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/admin/edit/:id",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <AdminEditPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/user/edit/:id",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <UserEditPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/tickets",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Tickets />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/monitoring",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Monitoring />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/monitoring/user/ticket/:idTicket/:idUser",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <MonitoringTicketDetail />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Settings />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings/profile",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <ProfileSettingPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings/password",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <PasswordSettingPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings/complaint",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <ComplaintSettingPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings/complaint/:id/:idUser",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <ComplaintDetailSettingPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings/update",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <UpdateSettingPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings/update/:id",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <UpdateDetailSettingPage />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/testing",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <PickTimer />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
