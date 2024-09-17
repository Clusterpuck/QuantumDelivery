import Register from "../components/Register";
import AccountDetails from "../pages/AccountDetails" 
import ViewRoutes from "../pages/ViewRoutes";
import Login from "../pages/Login";
import LiveTracking from "../pages/LiveTracking";
import DailyReports from "../pages/DailyReports";
import UploadRunsheet from "../pages/UploadRunsheet";
import Register from "../pages/Register";
import AddOrder from "../pages/AddOrder";
import PrivateRoute from "./PrivateRoute";  
import DriverViewRoutes from "../pages/DriverViewRoutes";

export const ROUTES = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/viewroutes",
    element: (
      <PrivateRoute role="ADMIN">
        <ViewRoutes />
      </PrivateRoute>
    ),
  },
  {
    path: "/livetracking",
    element: (
      <PrivateRoute role="ADMIN">
        <LiveTracking />
      </PrivateRoute>
    ),
  },
  {
    path: "/dailyreports",
    element: (
      <PrivateRoute role="ADMIN">
        <DailyReports />
      </PrivateRoute>
    ),
  },
  {
    path: "/uploadrunsheet",
    element: (
      <PrivateRoute role="ADMIN">
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
      <PrivateRoute role="ADMIN">
        <AddOrder />
      </PrivateRoute>
    ),
  },
  {
    path: "/addorder",
    element: (
      <PrivateRoute role="ADMIN">
        <AddOrder />
      </PrivateRoute>
    ),
  },
  {
    path: "/driverviewroutes",
    element: (
      <PrivateRoute role="ADMIN">
        <DriverViewRoutes />
      </PrivateRoute>
    ),
  },
];
