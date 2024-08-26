import RandomFactGenerator from "../../components/Home";
import ViewRoutes from "../components/ViewRoutes";
import LiveTracking from "../components/LiveTracking";
import DailyReports from "../components/DailyReports";
import UploadRunsheet from "../components/UploadRunsheet";
import Login from "../components/Login";
import Register from "../components/Register";
import AccountDetails from "../components/AccountDetails";
import { Link } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";  // Adjust the import path as needed

export const ROUTES = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/viewroutes",
    element: (
      <PrivateRoute>
        <ViewRoutes />
      </PrivateRoute>
    ),
  },
  {
    path: "/livetracking",
    element: (
      <PrivateRoute>
        <LiveTracking />
      </PrivateRoute>
    ),
  },
  {
    path: "/dailyreports",
    element: (
      <PrivateRoute>
        <DailyReports />
      </PrivateRoute>
    ),
  },
  {
    path: "/uploadrunsheet",
    element: (
      <PrivateRoute>
        <UploadRunsheet />
      </PrivateRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/accountdetails",
    element: (
      <PrivateRoute>
        <AccountDetails />
      </PrivateRoute>
    ),
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: (
      <PrivateRoute>
        <AddOrder />
      </PrivateRoute>
    ),
  },
];
