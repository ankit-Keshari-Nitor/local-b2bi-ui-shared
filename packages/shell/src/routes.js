import React from 'react';
import { PageNotFound, NotAuthorized } from './common/pages';

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
