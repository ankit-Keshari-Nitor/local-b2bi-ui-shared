import React from 'react';
import { Loading, Theme } from '@carbon/react';
import { usePage } from '../../core/providers/PageProvider';

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
  MODAL: 'page-type-modal'
};

const Page = ({ children, className, type, ...props }) => {
  const { loadingState } = usePage();
  return (
    <>
      <div className={' page-content ' + typeClasses[type ? type : 'DFAULT'] + ' ' + (className ? className : '')} {...props}>
        {loadingState && <Loading description={loadingStateConfig[loadingState]?.description} withOverlay={true} />}
        {children}
      </div>
    </>
  );
};

export { Page };
