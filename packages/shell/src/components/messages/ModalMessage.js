import React from 'react';
import { Modal } from '@carbon/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApplication } from '../../core';

const ModalMessage = () => {
  const { t } = useTranslation();
  const { modalMessage } = useApplication();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (modalMessage && modalMessage.heading) {
      setShowModal(true);
    }
  }, [modalMessage]);

  const onAction = (actionType) => {
    setShowModal(false);
    modalMessage.onAction(actionType);
  };
  return (
    <>
      {modalMessage && (
        <Modal
          open={showModal}
          danger={modalMessage?.isDanger}
          modalHeading={t(modalMessage?.heading)}
          modalLabel={t(modalMessage?.label)}
          primaryButtonText={t(modalMessage?.primaryButtonText)}
          secondaryButtonText={t(modalMessage?.secondaryButtonText)}
          onRequestClose={() => onAction(modalMessage.closeAction)}
          onRequestSubmit={() => onAction(modalMessage.primaryAction)}
          onSecondarySubmit={() => onAction(modalMessage.secondaryAction)}
        />
      )}
    </>
  );
};

export { ModalMessage };
