import React from 'react';
import { PageNotFound, NotAuthorized } from './common/pages';
import { routes as FeatureTestRoutes} from './featuret-test';


const routes = [
  {
    path: '*',
    element: <PageNotFound />
  },
  {
    path: '/notauthorized',
    element: <NotAuthorized />
  },
  ...FeatureTestRoutes
];

export { routes };
