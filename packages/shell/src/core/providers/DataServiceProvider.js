import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';
import { useEnvironment } from './EnvironmentProvider';
import axios from 'axios';

const DataServiceContext = React.createContext();

const DataServiceProvider = (props) => {
  const { getEnvironmentValue } = useEnvironment();
  const [moduleDataConfig, setModuleDataConfig] = useState({});
  const [globalDataConfig, setGlobalDataConfig] = useState({});
  const [interceptors, setInterceptors] = useState({});
  const [interceptorInstance, setInterceptorInstance] = useState();

  const getDataLoaderConfig = (dataLoaderId) => {
    const splitKeys = dataLoaderId.split('.');
    let value = { ...globalDataConfig, ...moduleDataConfig };
    splitKeys.forEach((splitKey) => {
      value = value[splitKey];
      if (value === undefined) {
        console.error('dataloader is not configured for ' + dataLoaderId);
        throw new Error({ error: 'dataloader is not configured for ' + dataLoaderId });
      }
    });
    return value({ getEnvironmentValue: getEnvironmentValue });
  };

  useEffect(() => {
    if (interceptorInstance) {
      axios.interceptors.request.eject(interceptorInstance);
    }
    setInterceptorInstance(
      axios.interceptors.request.use(
        function (config) {
          Object.keys(interceptors).forEach((interceptor) => {
            interceptors[interceptor].request && interceptors[interceptor].request(config);
          });

          return config;
        },
        function (error) {
          return Promise.reject(error);
        }
      )
    );
  }, [interceptors, setInterceptorInstance]); /* eslint-disable-line */

  const setInterceptor = (interceptorName, interceptor) => {
    setInterceptors((prevValue) => {
      const clonedInterceptors = { ...prevValue };
      clonedInterceptors[interceptorName] = interceptor;
      return clonedInterceptors;
    });
  };

  const value = {
    // `setModuleDataConfig: (moduleName, config) => {
    //   moduleDataConfig[moduleName] = config;
    // },`
    DataService: new DataService(getDataLoaderConfig, axios),
    setModuleDataConfig,
    setGlobalDataConfig,
    getDataLoaderConfig: getDataLoaderConfig,
    setInterceptor
  };
  return <DataServiceContext.Provider value={value}>{props.children}</DataServiceContext.Provider>;
};

const useDataService = () => {
  return React.useContext(DataServiceContext);
};

export { DataServiceContext, DataServiceProvider, useDataService };
