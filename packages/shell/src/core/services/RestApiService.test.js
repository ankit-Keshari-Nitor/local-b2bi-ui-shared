import { RestApiService } from './RestApiService';
import { HttpService } from './HttpService';
import { generatePath } from 'react-router-dom';

// Mock HttpService.send method
jest.mock('./HttpService');

describe('RestApiService', () => {
  let restApiService;

  // Initialize RestApiService before each test
  beforeEach(() => {
    restApiService = new RestApiService();
    HttpService.send.mockReset();
  });

  it('should construct the correct request and call HttpService.send', async () => {
    // Arrange
    const dataLoaderConfig = {
      url: '/api/v1/resource/:id',
      method: 'POST',
      handleUrl: (url, input, options) => `${url}?param=${options.params}`,
    };
    const input = { id: '123' };
    const options = { params: 'testParam' };

    // Expected request object
    const expectedRequest = {
      url: '/api/v1/resource/123?param=testParam',
      method: 'POST',
      data: input,
      params: options?.params,
      baseURL: window.sfgBackendBaseUrl,
    };

    // Act
    await restApiService.call(dataLoaderConfig, input, options);

    // Assert
    expect(HttpService.send).toHaveBeenCalledWith(expectedRequest);
  });

  it('should handle URL using dataLoaderConfig.handleUrl', async () => {
    // Arrange
    const dataLoaderConfig = {
      url: '/api/v1/resource/:id',
      method: 'POST',
      handleUrl: (url, input, options) => `${url}?customParam=${input.id}`,
    };
    const input = { id: '456' };
    const options = {};

    // Expected request object
    const expectedRequest = {
      url: '/api/v1/resource/456?customParam=456',
      method: 'POST',
      data: input,
      params: options?.params,
      baseURL: window.sfgBackendBaseUrl,
    };

    // Act
    await restApiService.call(dataLoaderConfig, input, options);

    // Assert
    expect(HttpService.send).toHaveBeenCalledWith(expectedRequest);
  });

  it('should use window.sfgBackendBaseUrl as baseURL', async () => {
    // Arrange
    const dataLoaderConfig = {
      url: '/api/v1/resource',
      method: 'GET',
    };
    const input = {};
    const options = {};

    // Expected request object
    const expectedRequest = {
      url: '/api/v1/resource',
      method: 'GET',
      data: input,
      params: options?.params,
      baseURL: window.sfgBackendBaseUrl,
    };

    // Act
    await restApiService.call(dataLoaderConfig, input, options);

    // Assert
    expect(HttpService.send).toHaveBeenCalledWith(expectedRequest);
  });
});