import React from 'react';
import { Layer, ModalHeader } from '@carbon/react';
import { usePage } from '../../core/providers/PageContainerProvider';
import { useModal } from '../../core';

const PageHeader = ({ title, description, ...props }) => {
  const { pageMode, pageController: page } = usePage();
  const { modalConfig } = useModal();

  const onModalClose = () => {
    modalConfig.onAction('cancel', {});
  };

  return (
    <>
      {pageMode === 'ROUTE_PAGE' && (
        <Layer className="page-header-container">
          <div className="cds--data-table-header">
            <h4 className="cds--data-table-header__title">{title}</h4>
            <p className="cds--data-table-header__description">{description}</p>
          </div>
        </Layer>
      )}
      {pageMode === 'MODAL_PAGE' && <ModalHeader className="sfg--modal-header" title={title} buttonOnClick={onModalClose} {...props} />}
    </>
  );
};

export { PageHeader };
