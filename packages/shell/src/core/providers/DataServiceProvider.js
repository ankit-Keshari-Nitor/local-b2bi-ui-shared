import React from 'react';
import { DataService } from '../services/DataService';
import { useEnvironment } from './EnvironmentProvider';

const DataServiceContext = React.createContext();

const DataServiceProvider = (props) => {
  const config = props.config;
  const moduleDataConfig = {};
  const globalDataConfig = {};
  const { getEnvironmentValue } = useEnvironment();

  const getDataLoaderConfig = (dataLoaderId) => {
    const splitKeys = dataLoaderId.split('.');
    let value = config;
    splitKeys.forEach((splitKey) => {
      value = value[splitKey];
      if (value === undefined) {
        console.error('dataloader is not configured for ' + dataLoaderId);
        throw new Error({ error: 'dataloader is not configured for ' + dataLoaderId });
      }
    });
    return value({ getEnvironmentValue: getEnvironmentValue });
  };
  const value = {
    // `setModuleDataConfig: (moduleName, config) => {
    //   moduleDataConfig[moduleName] = config;
    // },`
    DataService: new DataService(getDataLoaderConfig),
    getDataLoaderConfig: getDataLoaderConfig
  };
  return <DataServiceContext.Provider value={value}>{props.children}</DataServiceContext.Provider>;
};

const useDataService = () => {
  return React.useContext(DataServiceContext);
};

export { DataServiceContext, DataServiceProvider, useDataService };
