import React from 'react';
import { ModalBody } from '@carbon/react';
import { usePage } from '../../core/providers/PageContainerProvider';

const PageBody = ({ children, className, ...props }) => {
  const { pageMode } = usePage();
  return (
    <>
      {pageMode === 'ROUTE_PAGE' && (
        <>
          <div className={'sfg--page-body ' + (className ? className : '')} {...props}>
            {children}
          </div>
        </>
      )}
      {pageMode === 'MODAL_PAGE' && (
        <ModalBody className={'sfg--modal-body ' + (className ? className : '')} {...props}>
          {children}
        </ModalBody>
      )}
    </>
  );
};

export default PageBody;
export { PageBody };
