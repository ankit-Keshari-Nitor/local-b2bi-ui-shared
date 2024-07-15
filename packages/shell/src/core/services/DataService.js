import { RestApiService } from './RestApiService';
import { generatePath } from 'react-router-dom';

const generatePathWithConditionalTrailingSlash = (pathTemplate, params) => {
  const generatedPath = generatePath(pathTemplate, params);
  return pathTemplate.endsWith('/') ? `${generatedPath}/` : generatedPath;
};

class DataService {
  getDataLoaderConfig;
  constructor(getDataLoaderConfig) {
    this.getDataLoaderConfig = getDataLoaderConfig;
  }

  call(dataLoaderId, input, options) {
    try {
      const dataLoaderConfig = this.getDataLoaderConfig(dataLoaderId);
      dataLoaderConfig.url = generatePathWithConditionalTrailingSlash(dataLoaderConfig.url, input);
      if (dataLoaderConfig.handleUrl) {
        dataLoaderConfig.url = dataLoaderConfig.handleUrl(dataLoaderConfig.url, input, options);
      }
      const cloneInput = JSON.parse(JSON.stringify(input));
      dataLoaderConfig.handleInput && dataLoaderConfig.handleInput(cloneInput, options);

      if (dataLoaderConfig.mockResponse) {
        // Return a promise that resolves with the mock response
        return Promise.resolve({
          data: dataLoaderConfig.mockResponse(restReq.url, input, options),
          status: 200,
          statusText: 'OK',
          headers: {},
          config: restReq,
          request: null
        });
      } else {
        if (dataLoaderConfig.type === 'RESTAPI') {
          return new RestApiService().call(dataLoaderConfig, cloneInput, options);
        }
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
