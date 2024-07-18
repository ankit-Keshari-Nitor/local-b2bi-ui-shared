import React from 'react';
import { useModal } from '../../core/providers/ModalProvider';
import { ComposedModal, Layer } from '@carbon/react';
import { useEffect, useState } from 'react';
import { PageContainerProvider } from '../../core/providers/PageContainerProvider';

const modalSizeClasses = {
  lg: 'cds--modal-lg',
  md: 'cds--modal-md',
  sm: 'cds--modal-sm',
  xs: 'cds--modal-xs'
};

const ModalPageContainer = () => {
  const { getModalConfig, modalConfig, setModalConfig } = useModal();
  const [showModal, setShowModal] = useState(false);
  const [modalConfigObj, setModalConfigObj] = useState();

  useEffect(() => {
    if (modalConfig) {
      setModalConfigObj(getModalConfig(modalConfig.modalPage));
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [modalConfig, getModalConfig]);

  const close = () => {
    setShowModal(false);
    setModalConfigObj(undefined);
    setModalConfig(null);
  };
  return (
    <>
      <Layer level={1}>
        <ComposedModal
          open={showModal}
          size={modalConfigObj?.size}
          isFullWidth
          className={modalConfigObj ? modalSizeClasses[modalConfigObj.size] : ''}
          onClose={close}
          preventCloseOnClickOutside={true}
        >
          {showModal && modalConfigObj && modalConfig && <PageContainerProvider> {modalConfigObj.element}</PageContainerProvider>}
        </ComposedModal>
      </Layer>
    </>
  );
};

export { ModalPageContainer };
