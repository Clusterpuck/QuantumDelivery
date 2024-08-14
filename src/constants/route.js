import RandomFactGenerator from "../../components/Home";
import ViewRoutes from "../components/ViewRoutes";
import LiveTracking from "../components/LiveTracking";
import DailyReports from "../components/DailyReports";
import UploadRunsheet from "../components/UploadRunsheet";
import Login from "../components/Login";
import Register from "../components/Register";
import AccountDetails from "../components/AccountDetails";

export const ROUTES = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/viewroutes",
    element: <ViewRoutes />,
  },
  {
    path: "/livetracking",
    element: <LiveTracking />,
  },
  {
    path: "/dailyreports",
    element: <DailyReports />,
  },
  {
    path: "/uploadrunsheet",
    element: <UploadRunsheet />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/accountdetails",
    element: <AccountDetails />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: <RandomFactGenerator />,
  },

  
];

export default function ViewRoutes() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
        <h1>Page 1</h1>
        <a href="/">Back Home</a>
      </div>
    );
  }