import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { ROUTES } from "./routes";

// Creates the router, nothing here should need to be adjusted
export const router = createBrowserRouter(
  createRoutesFromElements(
    ROUTES.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))
  )
);