import React from 'react';
import { RoutePage } from '../components';

const FeatureTest = {
  FeatureTestPage: React.lazy(() => import('./FeatureTest'))
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
  }
];

export { routes };
