import { HttpService } from './HttpService';
import { generatePath } from 'react-router-dom';

class RestApiService {
  call(dataLoaderConfig, input, options) {
    const restReq = {
      url: generatePath(dataLoaderConfig.url, input),
      method: dataLoaderConfig.method,
      data: input,
      params: options?.params,
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
