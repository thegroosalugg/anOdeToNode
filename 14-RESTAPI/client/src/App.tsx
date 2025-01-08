import { useRoutes } from 'react-router-dom';
import   RootLayout  from './pages/RootLayout';
import     FeedPage  from './pages/FeedPage';
import     PostPage  from './pages/PostPage';
import     UserPage  from './pages/UserPage';
import    ErrorPage  from './pages/ErrorPage';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons'; // import brand icons
import { fas } from '@fortawesome/free-solid-svg-icons'; // import solid icons
import { far } from '@fortawesome/free-regular-svg-icons'; // import regular icons

library.add(fab, fas, far);

export default function App() {
  console.clear(); // **LOGDATA

  const element = useRoutes([
    {    path: '/',
      element: <RootLayout children={(user) => <FeedPage user={user} />} />,
    },
    {
         path: '/post/:postId',
      element: <RootLayout children={(user) => <PostPage user={user} />} />,
    },
    {
         path: '/account',
      element: <RootLayout children={(user) => <UserPage user={user} />} />,
    },
    {    path: '*',
      element: <RootLayout children={() => <ErrorPage />} />,
    },
  ]);

  if (!element) return null;

  return element;
}
