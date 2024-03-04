import React from 'react';
import { DataServiceProvider } from '../../core/providers/DataServiceProvider';
import { useResource } from '../../core/providers/ResourceProvider';

const RoutePage = ({ children, dataLoaderConfig, resourceKey, ...props }) => {
  const { hasAccess } = useResource();
  return (
    <>
      {' '}
      {hasAccess(resourceKey) ? (
        <React.Suspense fallback={<>...</>}>
          <DataServiceProvider config={dataLoaderConfig}>{children}</DataServiceProvider>
        </React.Suspense>
      ) : (
        <>Not Authorised</>
      )}
    </>
  );
};

export { RoutePage };