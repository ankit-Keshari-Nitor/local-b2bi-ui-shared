import React, { useState } from 'react';

const PageContext = React.createContext();

const pageState = Object.freeze({
  PAGE_INIT_PROGRESS: 'PAGE_INIT_DS_ERROR',
  PAGE_INIT_DS_ERROR: 'PAGE_INIT_DS_ERROR',
  PAGE_INITIALIZED: 'PAGE_INITIALIZED'
});

const PageProvider = (props) => {
  const [loadingState, setLoadingState] = useState();
  const [pageStatus, setPageStatus] = useState();
  //const [modalMessage, setModalMessage] = useState();
  // const [notificationMessage, setNotificationMessage] = useState();
  const [modalPage, setModalPage] = useState();

  const value = {
    loadingState: loadingState,
    setLoadingState: setLoadingState,
    PAGE_STATE: pageState,
    pageStatus, 
    setPageStatus,
    //modalMessage,
    //setModalMessage,
    modalPage, 
    setModalPage,
    //notificationMessage,
    //setNotificationMessage
  };

  return <PageContext.Provider value={value}>{props.children}</PageContext.Provider>;
};

const usePage = () => {
  return React.useContext(PageContext);
};

export { PageProvider, usePage };
