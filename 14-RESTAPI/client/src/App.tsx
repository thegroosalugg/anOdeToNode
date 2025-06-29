import { useRoutes } from 'react-router-dom';
import     AuthPage  from './pages/AuthPage';
import   RootLayout  from './pages/RootLayout';
import     FeedPage  from './pages/FeedPage';
import     PostPage  from './pages/PostPage';
import   SocialPage  from './pages/SocialPage';
import     PeerPage  from './pages/PeerPage';
import    ErrorPage  from './pages/ErrorPage';

import {  library  } from '@fortawesome/fontawesome-svg-core';
import {    fab    } from '@fortawesome/free-brands-svg-icons';  // import brand icons
import {    fas    } from '@fortawesome/free-solid-svg-icons';   // import solid icons
import {    far    } from '@fortawesome/free-regular-svg-icons'; // import regular icons

import { captainsLog } from './lib/util/captainsLog';
import { Auth, Authorized } from './lib/types/auth';

library.add(fab, fas, far);

const validate = (path: string, props: Auth) => {
  const { user } = props;

  if (!user) return <AuthPage auth={props} />;

  const authorized = props as Authorized;

  const elements = {
    '/feed':          <FeedPage   {...authorized} />,
    '/post/:postId':  <PostPage   {...authorized} />,
    '/social':        <SocialPage                 />, // props were never used here
    '/user/:userId':  <PeerPage   {...authorized} />,
  };

  return elements[path as keyof typeof elements];
};

const createRoute = (path: string) => ({
     path,
  element: <RootLayout children={(props) => validate(path, props)} />,
});

const routes = [
  { path: '/',  element: <RootLayout children={(props) => <AuthPage auth={props} />} /> },
  createRoute('/feed'),
  createRoute('/post/:postId'),
  createRoute('/social'),
  createRoute('/user/:userId'),
  { path: '*',  element: <RootLayout children={() => <ErrorPage />} /> },
];

export default function App() {
  captainsLog(-1, ['⇚⇚⇚App⇛⇛⇛']);

  const  element = useRoutes(routes);
  return element || null;
}
