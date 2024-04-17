import React, { useState } from 'react';

const NotificationContext = React.createContext();

const NotificationProvider = ({ children, modals }) => {
  const [toastMessage, setToastMessage] = useState([]);

  const showToastMessage = (messageObj) => {
    setToastMessage((prevToastMessage) => [messageObj, ...prevToastMessage]);
  };

  const closeToastMessage = (messageId) => {
    setToastMessage((prevToastMessage) => prevToastMessage.filter((message) => message.id !== messageId));
  };
  return (
    <NotificationContext.Provider
      value={{
        showToastMessage: showToastMessage,
        closeToastMessage: closeToastMessage,
        toastMessage: toastMessage
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => {
  return React.useContext(NotificationContext);
};

export { NotificationContext, NotificationProvider, useNotification };
