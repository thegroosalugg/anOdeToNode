import { useRoutes } from 'react-router-dom';
import RootLayout from './pages/RootLayout';
import FeedPage from './pages/FeedPage';
import PostPage from './pages/PostPage';
import ErrorPage from './pages/ErrorPage';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons'; // import brand icons
import { fas } from '@fortawesome/free-solid-svg-icons'; // import solid icons
import { far } from '@fortawesome/free-regular-svg-icons'; // import regular icons

library.add(fab, fas, far);

export default function App() {
  const element = useRoutes(
    [
      { path: '/',             element: <FeedPage /> },
      { path: '/post/:postId', element: <PostPage /> },
      { path: '*',             element: <ErrorPage /> },
    ]
  );

  if (!element) return null;

  return <RootLayout>{element}</RootLayout>;
}
