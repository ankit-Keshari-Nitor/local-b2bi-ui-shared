import React from 'react';
import { PageContainer } from '../components';

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
          <PageContainer  mode="ROUTE_PAGE">
            <FeatureTest.FeatureTestPage></FeatureTest.FeatureTestPage>
          </PageContainer>
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
          <PageContainer  mode="ROUTE_PAGE">
            <FeatureTest.FormTestPage></FeatureTest.FormTestPage>
          </PageContainer>
        )
      }
    ]
  }
];

export { routes };
