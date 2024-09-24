import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { default as useRouterBreadcrumbs } from 'use-react-router-breadcrumbs';
import { useRouter } from '../../core/providers/RouterProvider';

const BreadcrumbContext = createContext();

const BreadcrumbProvider = ({ children }) => {
  const { t } = useTranslation();
  const routes = useRouter();
  const staticBreadcrumbs = useRouterBreadcrumbs(routes);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const [dynamicBreadcrumbs, setDynnamicBreadcrumbs] = useState(() => {
    const savedBreadcrumbs = sessionStorage.getItem('breadcrumbs');
    return savedBreadcrumbs ? JSON.parse(savedBreadcrumbs) : {};
  });

  const { pathname } = useLocation();

  useEffect(() => {
    window.sessionStorage.setItem('breadcrumbs', JSON.stringify(dynamicBreadcrumbs || {}));
  }, [dynamicBreadcrumbs]);

  useEffect(() => {
    const newBreadcrumbs = staticBreadcrumbs.map(({ breadcrumb, match }, index, items) => {
      return {
        breadcrumbLabel: dynamicBreadcrumbs && dynamicBreadcrumbs[match.pathname] ? dynamicBreadcrumbs[match.pathname] : t(breadcrumb.props.children),
        pathname: match.pathname
      };
    });
    setBreadcrumbs(newBreadcrumbs);
    // console.log(newBreadcrumbs);
  }, [dynamicBreadcrumbs]);

  useEffect(() => {
    setDynnamicBreadcrumbs((prevBreadcrumbs) => {
      const filteredBreadcrumbs = Object.keys(prevBreadcrumbs).reduce((acc, key) => {
        if (pathname.indexOf(key) > -1) {
          acc[key] = prevBreadcrumbs[key];
        }
        return acc;
      }, {});
      return {
        ...filteredBreadcrumbs
      };
    });
  }, [pathname]);

  const setBreadcrumbLabel = (path, label) => {
    setDynnamicBreadcrumbs((prevBreadcrumbs) => {
      const filteredBreadcrumbs = Object.keys(prevBreadcrumbs).reduce((acc, key) => {
        if (pathname.indexOf(key) > -1) {
          acc[key] = prevBreadcrumbs[key];
        }
        return acc;
      }, {});
      return {
        ...filteredBreadcrumbs,
        [path]: label
      };
    });
  };

  return <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbLabel }}>{children}</BreadcrumbContext.Provider>;
};

const useBreadcrumbs = () => useContext(BreadcrumbContext);

export { BreadcrumbProvider, BreadcrumbContext, useBreadcrumbs };
