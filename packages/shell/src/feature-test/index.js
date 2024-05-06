import React from 'react';
import { RoutePage } from '../components';

const FeatureTest = {
  FeatureTestPage: React.lazy(() => import('./FeatureTest')),
  FormTestPage: React.lazy(() => import('./FormTest')),
};

const routes = [
  {
    path: 'shelltest',
    breadcrumb: 'shell:test.menu',
    children: [
      {
        path: '/feature',
        breadcrumb: 'shell:test.feature',
        element: (
          <RoutePage>
            <FeatureTest.FeatureTestPage></FeatureTest.FeatureTestPage>
          </RoutePage>
        )
      }
    ]
  },
  {
    path: 'shelltest',
    breadcrumb: 'shell:test.menu',
    children: [
      {
        path: '/form',
        breadcrumb: 'shell:test.form',
        element: (
          <RoutePage>
            <FeatureTest.FormTestPage></FeatureTest.FormTestPage>
          </RoutePage>
        )
      }
    ]
  }
];

export { routes };
