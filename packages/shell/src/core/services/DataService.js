import { RestApiService } from './RestApiService';

class DataService {
  getDataLoaderConfig;
  constructor(getDataLoaderConfig) {
    this.getDataLoaderConfig = getDataLoaderConfig;
  }

  call(dataLoaderId, input, options) {
    try {
      const dataLoaderConfig = this.getDataLoaderConfig(dataLoaderId);
      if (dataLoaderConfig.type === 'RESTAPI') {
        return new RestApiService().call(dataLoaderConfig, input, options);
      }
    } catch (err) {
      console.log(err);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }
  }
}

export { DataService };
