import "./lib/fontawesome/icons";
import { useRoutes } from "react-router-dom";
import  RootLayout   from "./pages/RootLayout";
import    AuthPage   from "./pages/AuthPage";
import    FeedPage   from "./pages/FeedPage";
import    PostPage   from "./pages/PostPage";
import  SocialPage   from "./pages/SocialPage";
import    PeerPage   from "./pages/PeerPage";
import   ErrorPage   from "./pages/ErrorPage";
import   AboutPage   from "./pages/static/AboutPage";
import   TermsPage   from "./pages/static/TermsPage";
import PrivacyPage   from "./pages/static/PrivacyPage";
// import    TestPage   from "./pages/TestPage";
import { captainsLog } from "./lib/util/captainsLog";
import { UserNullState } from "./lib/types/interface";

const validate = (path: string, props: UserNullState) => {
  const { user } = props;

  if (!user) return <AuthPage {...props} />;

  const elements = {
    "/feed":         <FeedPage />,
    "/post/:postId": <PostPage   {...{ user }} />,
    "/social":       <SocialPage {...{ user }} />,
    "/user/:userId": <PeerPage   {...{ user }} />,
  };

  return elements[path as keyof typeof elements];
};

const createRoute = (path: string, Component?: () => JSX.Element) => ({
  path,
  element: <RootLayout children={(props) => (Component ? <Component /> : validate(path, props))} />,
});

const routes = [
  { path: "/",     element: <RootLayout children={(props) => <AuthPage {...props} />} /> },
  // { path: "/test", element: <TestPage />},
  createRoute("/feed"),
  createRoute("/post/:postId"),
  createRoute("/social"),
  createRoute("/user/:userId"),
  createRoute("/about",     AboutPage),
  createRoute("/terms",     TermsPage),
  createRoute("/privacy", PrivacyPage),
  createRoute("*",          ErrorPage),
];

export default function App() {
  captainsLog(-1, { App: "new render cycle" });

  const element = useRoutes(routes);
  return element || null;
}
