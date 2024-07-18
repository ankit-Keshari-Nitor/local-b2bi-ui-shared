import { HttpService } from './HttpService';
import { generatePath } from 'react-router-dom';

// Function to add headers 
const addPemHeaders = (headers) => {
  const rHeaders = headers ? headers : {};
  rHeaders['Authorization'] = generateBasicAuthToken('admin', 'password');
  //rHeaders['Content-Type'] = 'application/json';
  rHeaders['Accept'] = 'application/json';
  return rHeaders;
};

// Function to add authentication to rest api 
const generateBasicAuthToken = (username, password) => {
  const credentials = `${username}:${password}`;
  const encodedCredentials = btoa(credentials);
  const authToken = `Basic ${encodedCredentials}`;

  return authToken;
};

// Function to add authentication url path
const generatePathWithConditionalTrailingSlash = (pathTemplate, params) => {
  const generatedPath = generatePath(pathTemplate, params);
  return pathTemplate.endsWith('/') ? `${generatedPath}/` : generatedPath;
};

class RestApiService {
  call(dataLoaderConfig, input, options) {
    const restReq = {
      url: generatePathWithConditionalTrailingSlash(dataLoaderConfig.url, input),
      method: dataLoaderConfig.method,
      data: input,
      params: options?.params,
      headers: addPemHeaders(options.headers),
      baseURL: window.sfgBackendBaseUrl
    };

    if (dataLoaderConfig.handleUrl) {
      restReq.url = dataLoaderConfig.handleUrl(restReq.url, input, options);
    }
    /*if (restReq.url.indexOf('/api/v1') > -1) {
      restReq.baseURL = window.location.host;
    }*/
    return HttpService.send(restReq);
  }
}

export { RestApiService };
