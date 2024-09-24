
import { useApplication } from '../providers';
import { useModal } from '../providers/ModalProvider';

const ModalUtil = () => {
  const { setModalConfig } = useModal();
  const { setModalMessage } = useApplication();

  const showPageModal = (modalPage, data) => {
    return new Promise(function (modalResolve, modalReject) {
      // setModalAction((actionType, data) => {
      //   modalResolve(actionType, data)
      // })
      // setModalPage(modalPage);
      // setModalData(data);
      setModalConfig({
        modalPage,
        data,
        onAction: (actionType, data) => {
          setModalConfig(undefined);
          modalResolve({actionType, data})
        }
      })
    });
  }

  const showMessageModal = (messageConfig) => {
    return new Promise(function (modalResolve, modalReject) {
      messageConfig.onAction = (actionType) => {
        modalResolve(actionType);
        setModalMessage(undefined);
      };
      setModalMessage(messageConfig);
    });
  };

  const showInformationModal = (message, options = {}) => {
    return showMessageModal({
        label: 'shell:modal.labels.info',
        heading: message,
        isDanger: false,
        primaryButtonText: 'shell:modal.actions.ok',
        secondaryButtonText: 'shell:modal.actions.cancel',
        closeAction: 'close',
        primaryAction: 'ok',
        secondaryAction: 'cancel',
        ...options
      });
  };

  const showConfirmationModal = (message, options = {}) => {
    return showMessageModal({
      label: 'shell:modal.labels.confirm',
      heading: message,
      isDanger: message.indexOf('delete') > -1,
      primaryButtonText: 'shell:modal.actions.confirm',
      secondaryButtonText: 'shell:modal.actions.cancel',
      closeAction: 'close',
      primaryAction: 'confirm',
      secondaryAction: 'cancel',
      ...options
    });
  };

  const showWarningModal = (message, options = {}) => {
    return showMessageModal({
        label: 'shell:modal.labels.warning',
        heading: message,
        isDanger: false,
        primaryButtonText: 'shell:modal.actions.ok',
        secondaryButtonText: 'shell:modal.actions.cancel',
        closeAction: 'close',
        primaryAction: 'ok',
        secondaryAction: 'cancel',
        ...options
      });
  };

  const showErrorModal = (message, options = {}) => {
    return showMessageModal({
        label: 'shell:modal.labels.error',
        heading: message,
        isDanger: false,
        primaryButtonText: 'shell:modal.actions.ok',
        secondaryButtonText: 'shell:modal.actions.cancel',
        closeAction: 'close',
        primaryAction: 'ok',
        secondaryAction: 'cancel',
        ...options
      });
  };

  return {
    showInformationModal,
    showConfirmationModal,
    showWarningModal,
    showErrorModal,
    showPageModal
  };
};

export { ModalUtil };
