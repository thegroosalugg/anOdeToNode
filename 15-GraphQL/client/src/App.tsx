import { useRoutes } from 'react-router-dom';
import {
            Auth,
         Authorized
                   } from './pages/RootLayout';
// import     AuthPage  from './pages/AuthPage';
import   RootLayout  from './pages/RootLayout';
import    ErrorPage  from './pages/ErrorPage';

import {  library  } from '@fortawesome/fontawesome-svg-core';
import {    fab    } from '@fortawesome/free-brands-svg-icons';  // import brand icons
import {    fas    } from '@fortawesome/free-solid-svg-icons';   // import solid icons
import {    far    } from '@fortawesome/free-regular-svg-icons'; // import regular icons

import { captainsLog } from './util/captainsLog';

library.add(fab, fas, far);

const validate = (path: string, props: Auth) => {
  const { user } = props;

  // if (!user) return <AuthPage auth={props} />;

  const authorized = props as Authorized;

  const elements = {

  };

  return elements[path as keyof typeof elements];
};

const createRoute = (path: string) => ({
     path,
  element: <RootLayout children={(props) => validate(path, props)} />,
});

const routes = [
  // { path: '/',  element: <RootLayout children={(props) => <AuthPage auth={props} />} /> },
  { path: '*',  element: <RootLayout children={() => <ErrorPage />} /> },
];

export default function App() {
  console.clear(); // **LOGDATA
  captainsLog(-1, ['⇚⇚⇚App⇛⇛⇛']);

  const  element = useRoutes(routes);
  return element || null;
}
