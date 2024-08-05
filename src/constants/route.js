import Home from "../../components/Home";
import TestPage from "../components/ViewRoutes";

export const ROUTES = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/testpage",
    element: <TestPage />,
  },
];

export default function TestPage() {
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