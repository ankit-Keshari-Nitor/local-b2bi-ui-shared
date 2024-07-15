import React, { useEffect } from 'react';
import { DataServiceProvider } from '../../core/providers/DataServiceProvider';
import { useResource } from '../../core/providers/ResourceProvider';
import { usePage } from '../../core/providers/PageContainerProvider';

const PageContainer = ({ children, mode, dataLoaderConfig, resourceKey, ...props }) => {
  const { hasAccess } = useResource();
  const { setPageMode } = usePage();

  useEffect(() => {
    setPageMode(mode);
  }, []);

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

export { PageContainer };
