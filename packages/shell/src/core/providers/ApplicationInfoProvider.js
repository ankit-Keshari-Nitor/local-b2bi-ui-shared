import React, { createContext, useState, useContext } from 'react';

// Create a context object
const ApplicationInfoContext = createContext();

// Create a context provider component
const ApplicationInfoProvider = ({ children }) => {
  // State to store user details
  const [userContext, setUserContext] = useState({});

  const [defaultRoute, setDefaultRoute] = useState('/');

  // State to store app details
  const [appContext, setAppContext] = useState({});

  const [organizationContext, setOrganizationContext] = useState({});

  const setDefaults = () => {
    const userContextStr = window.sessionStorage.getItem('userContext');
    let userContext = {};
    if (userContextStr !== '' && userContextStr !== null) {
      userContext = JSON.parse(userContextStr);
    }
    const orgContextStr = window.sessionStorage.getItem('orgContext');
    let orgContext = {};
    if (orgContextStr !== '' && orgContextStr !== null) {
      orgContext = JSON.parse(orgContextStr);
    }
    const appContextStr = window.sessionStorage.getItem('appContext');
    let appContext = {};
    if (appContextStr !== '' && appContextStr !== null) {
      appContext = JSON.parse(appContextStr);
    }

    const defaultRouteStr = window.sessionStorage.getItem('defaultRoute');
    setDefaultRoute(defaultRouteStr);
    setUserContext(userContext);
    setAppContext(appContext);
    setOrganizationContext(orgContext);
  };

  return (
    <ApplicationInfoContext.Provider
      value={{
        userContext,
        setUserContext,
        appContext,
        setAppContext,
        organizationContext,
        setOrganizationContext,
        defaultRoute,
        setDefaultRoute,
        setDefaults
      }}
    >
      {children}
    </ApplicationInfoContext.Provider>
  );
};

// Custom hook to access the context values
const useApplicationInfo = () => {
  return useContext(ApplicationInfoContext);
};

export { ApplicationInfoProvider, useApplicationInfo };
