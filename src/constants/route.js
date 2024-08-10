import Home from "../../components/Home";
import ViewRoutes from "../components/ViewRoutes";
import LiveTracking from "../components/LiveTracking";
import DailyReports from "../components/DailyReports";
import UploadRunsheet from "../components/UploadRunsheet";

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