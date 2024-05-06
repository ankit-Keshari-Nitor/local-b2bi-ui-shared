import React, { createContext, useState, useContext } from 'react';

// Create a context object
const ApplicationInfoContext = createContext();

// Create a context provider component
const ApplicationInfoProvider = ({ children }) => {
  // State to store user details
  const [userDetails, setUserDetails] = useState(null);

  const appContextStr = window.sessionStorage.getItem('appContext');
  let appContext = {};
  if (appContextStr !== '' && appContextStr !== null) {
    appContext = JSON.parse(appContextStr);
  }
  // State to store app details
  const [appDetails, setAppDetails] = useState({
    defaultRoute: '/manage/myorganization',
    context: appContext
  });

  const [organizationContext, setOrganizationContext] = useState({
    organizationKey: 'DEFAULT',
    organizationName: 'Default Organization'
  });

  // State to store organization details
  const [organizationDetails, setOrganizationDetails] = useState(null);

  return (
    <ApplicationInfoContext.Provider
      value={{
        userDetails,
        setUserDetails,
        appDetails,
        setAppDetails,
        organizationDetails,
        setOrganizationDetails
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
