import React, { useEffect } from 'react';
import { Loading, Theme } from '@carbon/react';
import { usePage } from '../../core/providers/PageProvider';
import { usePage as usePageContainer } from '../../core/providers/PageContainerProvider';
import { useBreadcrumbs } from '../../components/Breadcrumb/BreadcrumbProvider';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const loadingStateConfig = {
  init: {
    description: 'Loading initial page data'
  },
  save: {
    description: 'Saving page data'
  }
};

const typeClasses = {
  DEFAULT: 'page-type-default',
  LIST: 'page-type-list',
  DETAILS: 'page-type-details',
  ADDEDIT: 'page-type-add-edit',
  MODAL: 'page-type-modal',
  WIZARD: 'page-type-wizard'
};

const Page = ({ children, className, type, mode, breadcrumb, ...props }) => {
  const { loadingState, PAGE_STATE, pageStatus } = usePage();
  const { pageMode } = usePageContainer();
  const { pathname } = useLocation();
  const { setBreadcrumbLabel } = useBreadcrumbs();
  const { t } = useTranslation();

  useEffect(() => {
    if (pageMode === 'ROUTE_PAGE' && breadcrumb !== undefined && breadcrumb !== '') {
      setBreadcrumbLabel(pathname.replace('/edit', ''), breadcrumb);
    }
  }, [breadcrumb]);

  return (
    <>
      <div className={' page-content ' + typeClasses[type ? type : 'DEFAULT'] + ' ' + (className ? className : '')} {...props}>
        {loadingState && <Loading description={loadingStateConfig[loadingState]?.description} withOverlay={true} />}
        {pageStatus !== PAGE_STATE.PAGE_INIT_DS_ERROR ? children : <>{t('shell:common.messages.pageLoadError')}</>}
      </div>
    </>
  );
};

export { Page };
