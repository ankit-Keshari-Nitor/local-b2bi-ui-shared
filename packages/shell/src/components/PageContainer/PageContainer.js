import React, { useEffect, useState } from 'react';
import { useDataService } from '../../core/providers/DataServiceProvider';
import { useResource } from '../../core/providers/ResourceProvider';
import { usePage } from '../../core/providers/PageContainerProvider';

const PageContainer = ({ children, mode, dataLoaderConfig, resourceKey, ...props }) => {
  const { hasAccess } = useResource();
  const { setPageMode } = usePage();
  const { setModuleDataConfig } = useDataService();
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    setPageMode(mode);
    setModuleDataConfig(dataLoaderConfig);
    setShowPage(true);
  }, []);

  return <> {hasAccess(resourceKey) ? <React.Suspense fallback={<>...</>}>{showPage && children}</React.Suspense> : <>Not Authorised</>}</>;
};

export { PageContainer };
