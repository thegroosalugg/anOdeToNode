import  RootLayout from "@/pages/RootLayout";
import    AuthPage from "@/pages/AuthPage";
import    FeedPage from "@/pages/FeedPage";
import    PostPage from "@/pages/PostPage";
import  SocialPage from "@/pages/SocialPage";
import    PeerPage from "@/pages/PeerPage";
import   ErrorPage from "@/pages/ErrorPage";
import   AboutPage from "@/pages/static/AboutPage";
import   TermsPage from "@/pages/static/TermsPage";
import PrivacyPage from "@/pages/static/PrivacyPage";
import {  Routes, ROUTES } from "./paths";
import { UserNullState } from "@/lib/types/interface";

const { home, feed, postId, social, userId, about, terms, privacy, error } = ROUTES;

const validate = (path: Routes, props: UserNullState) => {
  const { user } = props;

  if (!user) return <AuthPage {...props} />;

  const elements = {
      [feed]: <FeedPage />,
    [postId]: <PostPage   {...{ user }} />,
    [social]: <SocialPage {...{ user }} />,
    [userId]: <PeerPage   {...{ user }} />,
  };

  return elements[path as keyof typeof elements];
};

const createRoute = (path: Routes, Component?: () => JSX.Element) => ({
     path,
  element: <RootLayout children={(props) => (Component ? <Component /> : validate(path, props))} />,
});

export const routes = [
  { path: home, element: <RootLayout children={(props) => <AuthPage {...props} />} /> },
  createRoute(feed),
  createRoute(postId),
  createRoute(social),
  createRoute(userId),
  createRoute(about,   AboutPage),
  createRoute(terms,   TermsPage),
  createRoute(privacy, PrivacyPage),
  createRoute(error,   ErrorPage),
];
