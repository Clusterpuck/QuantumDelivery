import Register from "../components/Register";
import AccountDetails from "../pages/AccountDetails" 
import ViewRoutes from "../pages/ViewRoutes";
import Login from "../pages/Login";
import LiveTracking from "../pages/LiveTracking";
import DailyReports from "../pages/DailyReports";
import UploadRunsheet from "../pages/UploadRunsheet";
import Register from "../pages/Register";
import AddOrder from "../pages/AddOrder";
import { Link } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";  

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
  {
    path: "/addorder",
    element: (
      <PrivateRoute>
        <AddOrder />
      </PrivateRoute>
    ),
  },
];
