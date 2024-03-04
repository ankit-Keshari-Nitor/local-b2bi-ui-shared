import React from 'react';

const EnvironmentContext = React.createContext();

const EnvironmentProvider = (props) => {
  const config = props.config;
  const value = {
    getEnvironmentValue: (key) => {
        const splitKeys = key.split(".");
        let value = config;
        splitKeys.forEach(splitKey => {
            value = value[splitKey];
        });
      return value;
    }
  };
  return <EnvironmentContext.Provider value={value}>{props.children}</EnvironmentContext.Provider>;
};

const useEnvironment = () => {
  return React.useContext(EnvironmentContext);
};

export { EnvironmentContext, EnvironmentProvider, useEnvironment };
