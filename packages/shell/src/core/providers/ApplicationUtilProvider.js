import React, { createContext, useState, useContext } from 'react';

// Create a context object
const ApplicationUtilContext = createContext();

// Create a context provider component
const ApplicationUtilProvider = ({ children }) => {
  const [pageUtil, setPageUtil] = useState();

  return (
    <ApplicationUtilContext.Provider
      value={{
        pageUtil,
        setPageUtil
      }}
    >
      {children}
    </ApplicationUtilContext.Provider>
  );
};

const useApplicationUtil = () => {
  return useContext(ApplicationUtilContext);
};

export { ApplicationUtilProvider, useApplicationUtil, ApplicationUtilContext };
