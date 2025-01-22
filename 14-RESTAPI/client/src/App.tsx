import { useRoutes } from 'react-router-dom';
import {    Auth   } from './pages/RootLayout';
import     AuthPage  from './pages/AuthPage';
import   RootLayout  from './pages/RootLayout';
import     FeedPage  from './pages/FeedPage';
import     PostPage  from './pages/PostPage';
import   SocialPage  from './pages/SocialPage';
import     PeerPage  from './pages/PeerPage';
import    ErrorPage  from './pages/ErrorPage';

import { library } from '@fortawesome/fontawesome-svg-core';
import {   fab   } from '@fortawesome/free-brands-svg-icons';  // import brand icons
import {   fas   } from '@fortawesome/free-solid-svg-icons';   // import solid icons
import {   far   } from '@fortawesome/free-regular-svg-icons'; // import regular icons
import { captainsLog } from './util/captainsLog';

library.add(fab, fas, far);

type AppRoutes = 'feed' | 'post' | 'social' | 'peer';

const validate = (path: AppRoutes, props: Auth) => {
  const { user } = props;

  if (!user) return <AuthPage auth={props} />;

  const elements = {
      feed: <FeedPage   {...props} />,
      post: <PostPage   {...props} />,
    social: <SocialPage {...props} />,
      peer: <PeerPage   {...props} />,
  } as const;

  return elements[path];
};

export default function App() {
  console.clear(); // **LOGDATA
  captainsLog(-100, -10, ['⇚⇚⇚App⇛⇛⇛']);

  const element = useRoutes([
    {    path: '/',
      element: <RootLayout children={(props) => <AuthPage auth={props} />} />,
    },
    {
         path: '/feed',
      element: <RootLayout children={(props) => validate('feed',   props)} />,
    },
    {
         path: '/post/:postId',
      element: <RootLayout children={(props) => validate('post',   props)} />,
    },
    {
         path: '/social',
      element: <RootLayout children={(props) => validate('social', props)} />,
    },
    {
         path: '/user/:userId',
      element: <RootLayout children={(props) => validate('peer',   props)} />,
    },
    {    path: '*',
      element: <RootLayout children={() => <ErrorPage />} />,
    },
  ]);

  if (!element) return null;

  return element;
}
