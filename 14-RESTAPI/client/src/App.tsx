import "./lib/fontawesome/icons";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes/routes";
import { captainsLog } from "./lib/util/captainsLog";

export default function App() {
  captainsLog(-1, { App: "new render cycle" });
  const  element = useRoutes(routes);
  return element || null;
}
