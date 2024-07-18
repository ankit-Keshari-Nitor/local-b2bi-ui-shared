import React, { useState, useEffect } from 'react';
import { DataService } from '../services/DataService';
import { useEnvironment } from './EnvironmentProvider';
import axios from 'axios';

const DataServiceContext = React.createContext();

const DataServiceProvider = (props) => {
  const { getEnvironmentValue } = useEnvironment();
  const [moduleDataConfig, setModuleDataConfig] = useState({});
  const [globalDataConfig, setGlobalDataConfig] = useState({});
  const [interceptor, setInterceptor] = useState({});

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
    axios.interceptors.request.use(
      function (config) {
        console.log('AXIOS_CONFIG', config);
        interceptor.request && interceptor.request(config);
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }, [interceptor]);

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
