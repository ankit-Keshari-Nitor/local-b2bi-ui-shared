import React from 'react';
import { useModal } from '../../core/providers/ModalProvider';
import { Modal, ComposedModal, Layer } from '@carbon/react';
import { useEffect, useState } from 'react';

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
  }, [modalConfig]);

  const close = () => {
    setShowModal(false);
    setModalConfigObj(undefined);
    setModalConfig(null);
  };
  return (
    <>
      <Layer>
        <ComposedModal
          open={showModal}
          size="lg"
          isFullWidth
          className={modalConfigObj ? modalSizeClasses[modalConfigObj.size] : ''}
          onClose={close}
          preventCloseOnClickOutside={true}
        >
          {showModal && modalConfigObj && modalConfigObj.element}
        </ComposedModal>
      </Layer>
    </>
  );
};

export { ModalPageContainer };
