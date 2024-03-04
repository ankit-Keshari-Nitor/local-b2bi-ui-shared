import { createHashRouter, RouterProvider as RP } from 'react-router-dom';
import * as React from 'react';

const RouterContext = React.createContext();

const RouterProvider = (props) => {
  const processRoutes = (routes) => {
    const outputRoutes = [];
    routes.forEach((route) => {
      if (route.children) {
        const children = processRoutes(route.children);
        outputRoutes.push({ ...route, children });
      } else {
        outputRoutes.push({ ...route });
      }
    });
    return outputRoutes;
  };
  return (
    <RouterContext.Provider value={props.routes}>
      <RP router={createHashRouter(processRoutes(props.routes))} />
    </RouterContext.Provider>
  );
};

const useRouter = () => {
  return React.useContext(RouterContext);
};

export { RouterProvider, useRouter };
