import React, { createContext, useState, useContext } from 'react';
import { EnvironmentProvider } from './EnvironmentProvider';
import { DataServiceProvider } from './DataServiceProvider';
import { ApplicationInfoProvider } from './ApplicationInfoProvider';
import { ApplicationUtilProvider } from './ApplicationUtilProvider';
import { AuthProvider } from './AuthProvider';
import { ConfigurationProvider } from './ConfigurationProvider';
import { ResourceProvider } from './ResourceProvider';
import { ModalProvider } from './ModalProvider';
import { NotificationProvider } from './NotificationProvider';
import { RouterProvider } from './RouterProvider';
import { SidePageProvider } from '../../components';

const ApplicationContext = createContext();

const ApplicationProvider = ({
  envConfig,
  authHandler,
  authConfig,
  locales,
  locale = 'en_US',
  resourceMappings,
  features,
  modals,
  appConfigurator: AppConfiguration,
  routes,
  sidePages,
  children
}) => {
  const [modalMessage, setModalMessage] = useState();
  const [notificationMessage, setNotificationMessage] = useState();
  const [modalPage, setModalPage] = useState();

  const value = {
    modalMessage,
    setModalMessage,
    notificationMessage,
    setNotificationMessage,
    modalPage,
    setModalPage
  };

  return (
    <ApplicationContext.Provider value={value}>
      <EnvironmentProvider config={envConfig}>
        <DataServiceProvider>
          <ApplicationInfoProvider>
            <ApplicationUtilProvider>
              <AuthProvider handler={authHandler} oidcConfig={authConfig}>
                <ConfigurationProvider locales={locales} locale={locale}>
                  <ResourceProvider resourceMappings={resourceMappings} features={features}>
                    <ModalProvider modals={modals}>
                      <SidePageProvider sidePages={sidePages} >
                        <NotificationProvider>
                          <AppConfiguration>
                            <RouterProvider routes={routes}></RouterProvider>
                          </AppConfiguration>
                        </NotificationProvider>
                      </SidePageProvider>
                    </ModalProvider>
                  </ResourceProvider>
                </ConfigurationProvider>
              </AuthProvider>
            </ApplicationUtilProvider>
          </ApplicationInfoProvider>
        </DataServiceProvider>
      </EnvironmentProvider>
      {children}
    </ApplicationContext.Provider>
  );
};

const useApplication = () => {
  return useContext(ApplicationContext);
};

export { ApplicationProvider, useApplication, ApplicationContext };
