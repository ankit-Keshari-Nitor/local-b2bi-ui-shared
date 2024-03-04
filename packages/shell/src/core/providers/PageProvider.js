import React, { useState } from 'react';

const PageContext = React.createContext();

const PageProvider = (props) => {
  const [loadingState, setLoadingState] = useState();
  const [modalMessage, setModalMessage] = useState();
  const [notificationMessage, setNotificationMessage] = useState();
  const [modalPage, setModalPage] = useState();

  const value = {
    loadingState: loadingState,
    setLoadingState: setLoadingState,
    modalMessage,
    setModalMessage,
    modalPage, 
    setModalPage,
    notificationMessage,
    setNotificationMessage
  };

  return <PageContext.Provider value={value}>{props.children}</PageContext.Provider>;
};

const usePage = () => {
  return React.useContext(PageContext);
};

export { PageProvider, usePage };
