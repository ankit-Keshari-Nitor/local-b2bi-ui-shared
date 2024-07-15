import React, { useState } from 'react';

const PageContainerContext = React.createContext();

const PageContainerProvider = ({ children, ...props }) => {
  const [pageMode, setPageMode] = useState();
  const [pageController, setPageController] = useState();

  const value = {
    pageMode,
    setPageMode,
    pageController,
    setPageController
  };

  return <PageContainerContext.Provider value={value}>{children}</PageContainerContext.Provider>;
};

const usePage = () => {
  return React.useContext(PageContainerContext);
};

export { PageContainerProvider, usePage };
