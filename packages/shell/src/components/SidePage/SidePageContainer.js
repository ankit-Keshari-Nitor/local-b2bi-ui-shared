import React from 'react';
import { useSidePage } from './SidePageProvider';
import { Layer } from '@carbon/react';
import { useEffect, useState } from 'react';
import { PageContainerProvider } from '../../core/providers/PageContainerProvider';
import './SidePageContainer.scss';

const sidePageSizeClasses = {
  fs: 'cds--sidePage cds--sidePage-fs',
  xl: 'cds--sidePage cds--sidePage-xl',
  lg: 'cds--sidePage cds--sidePage-lg',
  md: 'cds--sidePage cds--sidePage-md',
  sm: 'cds--sidePage cds--sidePage-sm',
  xs: 'cds--sidePage cds--sidePage-xs'
};

const SidePageContainer = () => {
  const { getSidePageConfig, sidePageConfig, setSidePageConfig } = useSidePage();
  const [showSidePage, setShowSidePage] = useState(false);
  const [sidePageConfigObj, setSidePageConfigObj] = useState();

  useEffect(() => {
    if (sidePageConfig) {
      setSidePageConfigObj(getSidePageConfig(sidePageConfig.sidePage));
      setShowSidePage(true);
    } else {
      setShowSidePage(false);
      setSidePageConfigObj(undefined);
      setSidePageConfig(null);
    }
  }, [sidePageConfig, getSidePageConfig]);

  return (
    <>
      <Layer level={1} className={sidePageConfigObj ? sidePageSizeClasses[sidePageConfigObj.size] : ''}>
        {showSidePage && sidePageConfigObj && sidePageConfig && <PageContainerProvider> {sidePageConfigObj.element}</PageContainerProvider>}
      </Layer>
    </>
  );
};

export { SidePageContainer };
