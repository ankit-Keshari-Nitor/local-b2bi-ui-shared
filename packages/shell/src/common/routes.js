import { PageNotFound } from './pages/PageNotFound';
import { NotAuthorized } from './pages/NotAuthorized';

const routes = [
  {
    path: '*',
    element: <PageNotFound />
  },
  {
    path: '/notauthorized',
    element: <NotAuthorized />
  }
];

export { routes };
