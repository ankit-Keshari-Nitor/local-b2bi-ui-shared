// import { RestApiService } from './RestApiService';
import { generatePath } from 'react-router-dom';
import { ObjectUtil } from '../utils';

const generatePathWithConditionalTrailingSlash = (pathTemplate, params) => {
  const generatedPath = generatePath(pathTemplate, params);
  return pathTemplate.endsWith('/') ? `${generatedPath}/` : generatedPath;
};

function customParamsSerializer(params) {
  const parts = [];

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach((val) => {
          if (val !== undefined && val !== null) {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
          }
        });
      } else if (value !== undefined && value !== null) {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    }
  }

  return parts.join('&');
}

class DataService {
  getDataLoaderConfig;
  axios;
  constructor(getDataLoaderConfig, axios) {
    this.getDataLoaderConfig = getDataLoaderConfig;
    this.axios = axios;
  }

  call(dataLoaderId, input, options) {
    try {
      const dataLoaderConfig = this.getDataLoaderConfig(dataLoaderId);
      dataLoaderConfig.url = generatePathWithConditionalTrailingSlash(dataLoaderConfig.url, input);
      if (dataLoaderConfig.handleUrl) {
        dataLoaderConfig.url = dataLoaderConfig.handleUrl(dataLoaderConfig.url, input, options);
      }
      let cloneInput;
      if (input instanceof FormData) {
        //TODO: Form data need to be clone
        cloneInput = input;
      } else {
        cloneInput = ObjectUtil.deepClone(input);
      }

      dataLoaderConfig.handleInput && dataLoaderConfig.handleInput(cloneInput, options);

      if (dataLoaderConfig.mockResponse) {
        // Return a promise that resolves with the mock response
        return Promise.resolve({
          data: dataLoaderConfig.mockResponse(dataLoaderConfig.url, cloneInput, options),
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
          request: null
        });
      } else {
        if (dataLoaderConfig.type === 'RESTAPI') {
          // return new RestApiService().call(dataLoaderConfig, cloneInput, options);
          const restReq = {
            url: dataLoaderConfig.url,
            method: dataLoaderConfig.method,
            data: cloneInput,
            params: options?.params,
            headers: options?.headers,
            paramsSerializer: customParamsSerializer
          };
          return this.axios(restReq);
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
