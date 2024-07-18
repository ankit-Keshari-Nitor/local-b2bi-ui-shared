import React, { useState } from 'react';

const SidePageContext = React.createContext();

const SidePageProvider = ({ children, sidePages }) => {
  const [sidePage, setSidePage] = useState();
  const [sidePageData, setSidePageData] = useState();
  const [sidePageAction, setSidePageAction] = useState();
  const [sidePageConfig, setSidePageConfig] = useState();

  return (
    <SidePageContext.Provider
      value={{
        getSidePageConfig: (key) => {
          return sidePages.find((item) => {
            return item.page === key;
          });
        },
        sidePage,
        setSidePage,
        sidePageData,
        setSidePageData,
        sidePageAction,
        setSidePageAction,
        sidePageConfig,
        setSidePageConfig
      }}
    >
      {children}
    </SidePageContext.Provider>
  );
};

const useSidePage = () => {
  return React.useContext(SidePageContext);
};

export { SidePageContext, SidePageProvider, useSidePage };
