import React, { useState } from 'react';

const ModalContext = React.createContext();

const ModalProvider = ({ children, modals }) => {
  const [modalPage, setModalPage] = useState();
  const [modalData, setModalData] = useState();
  const [modalAction, setModalAction] = useState();
  const [modalConfig, setModalConfig] = useState();

  return (
    <ModalContext.Provider
      value={{
        getModalConfig: (key) => {
          return modals.find((item) => {
            return item.page === key;
          });
        },
        modalPage,
        setModalPage,
        modalData,
        setModalData,
        modalAction,
        setModalAction,
        modalConfig,
        setModalConfig
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

const useModal = () => {
  return React.useContext(ModalContext);
};

export { ModalContext, ModalProvider, useModal };
