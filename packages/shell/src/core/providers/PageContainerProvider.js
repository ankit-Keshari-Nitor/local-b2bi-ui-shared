import React, { useEffect, useState } from 'react';

const PageContainerContext = React.createContext();

const PageContainerProvider = ({ children, ...props }) => {
  const [pageMode, setPageMode] = useState();
  const [pageController, setPageController] = useState();

  const [isRoutePage, setIsRoutePage] = useState(false);
  const [isModalPage, setIsModalPage] = useState(false);
  const [isSidePage, setIsSidePage] = useState(false);

  useEffect(() => {
    if (pageMode === 'ROUTE_PAGE') {
      setIsRoutePage(true);
    } else if (pageMode === 'MODAL_PAGE') {
      setIsModalPage(true);
    } else if (pageMode === 'SIDE_PAGE') {
      setIsSidePage(true);
    }
  }, [pageMode]);

  const value = {
    pageMode,
    setPageMode,
    isRoutePage,
    isModalPage,
    isSidePage,
    pageController,
    setPageController
  };

  return <PageContainerContext.Provider value={value}>{children}</PageContainerContext.Provider>;
};

const usePage = () => {
  return React.useContext(PageContainerContext);
};

export { PageContainerProvider, usePage };
