import "./lib/fontawesome/icons";
import { useRoutes } from "react-router-dom";
import  RootLayout   from "./pages/layout/RootLayout";
import    AuthPage   from "./pages/AuthPage";
import    FeedPage   from "./pages/FeedPage";
import    PostPage   from "./pages/PostPage";
import  SocialPage   from "./pages/SocialPage";
import    PeerPage   from "./pages/PeerPage";
import   AboutPage   from "./pages/info/AboutPage";
import   ErrorPage   from "./pages/boundary/ErrorPage";
import   TermsPage   from "./pages/info/TermsPage";
import { captainsLog } from "./lib/util/captainsLog";
import { Auth, Authorized } from "./lib/types/auth";

const validate = (path: string, props: Auth) => {
  const { user } = props;

  if (!user) return <AuthPage {...props} />;

  const authorized = props as Authorized;

  const elements = {
    "/feed":         <FeedPage   {...authorized} />,
    "/post/:postId": <PostPage   {...authorized} />,
    "/social":       <SocialPage {...authorized} />,
    "/user/:userId": <PeerPage   {...authorized} />,
  };

  return elements[path as keyof typeof elements];
};

const createRoute = (path: string, Component?: () => JSX.Element) => ({
  path,
  element: <RootLayout children={(props) => (Component ? <Component /> : validate(path, props))} />,
});

const routes = [
  { path: "/", element: <RootLayout children={(props) => <AuthPage {...props} />} /> },
  createRoute("/feed"),
  createRoute("/post/:postId"),
  createRoute("/social"),
  createRoute("/user/:userId"),
  createRoute("/about", AboutPage),
  createRoute("/terms", TermsPage),
  createRoute("*",      ErrorPage),
];

export default function App() {
  captainsLog(-1, { App: "new render cycle" });

  const element = useRoutes(routes);
  return element || null;
}
