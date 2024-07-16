import React, { useEffect } from 'react';
import { useDataService } from '../../core/providers/DataServiceProvider';
import { useResource } from '../../core/providers/ResourceProvider';
import { usePage } from '../../core/providers/PageContainerProvider';

const PageContainer = ({ children, mode, dataLoaderConfig, resourceKey, ...props }) => {
  const { hasAccess } = useResource();
  const { setPageMode } = usePage();
  const { setModuleDataConfig } = useDataService();

  useEffect(() => {
    setPageMode(mode);
    setModuleDataConfig(dataLoaderConfig);
  }, []);

  return <> {hasAccess(resourceKey) ? <React.Suspense fallback={<>...</>}>{children}</React.Suspense> : <>Not Authorised</>}</>;
};

export { PageContainer };
