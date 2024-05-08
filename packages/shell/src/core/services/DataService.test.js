import { DataService } from './DataService';
import { RestApiService } from './RestApiService';

// Mock RestApiService
jest.mock('./RestApiService');

// Mock RestApiService call method
const mockCall = jest.fn();
RestApiService.mockImplementation(() => ({
  call: mockCall
}));

describe('DataService', () => {
  // Mock getDataLoaderConfig
  const mockGetDataLoaderConfig = jest.fn();

  beforeEach(() => {
    // Reset mocks and spies before each test
    mockCall.mockReset();
    mockGetDataLoaderConfig.mockReset();
  });

  it('should call RestApiService.call when dataLoaderConfig type is RESTAPI', async () => {
    // Arrange
    const dataLoaderId = 'testId';
    const input = { param: 'value' };
    const options = { option1: 'value1' };
    const dataLoaderConfig = {
      type: 'RESTAPI',
      otherConfig: 'someConfig'
    };

    // Mock getDataLoaderConfig to return the dataLoaderConfig
    mockGetDataLoaderConfig.mockReturnValue(dataLoaderConfig);

    // Create an instance of DataService
    const dataService = new DataService(mockGetDataLoaderConfig);

    // Act
    await dataService.call(dataLoaderId, input, options);

    // Assert
    expect(mockCall).toHaveBeenCalledWith(dataLoaderConfig, input, options);
  });

  it('should reject the promise if an error occurs', async () => {
    // Arrange
    const dataLoaderId = 'testId';
    const input = { param: 'value' };
    const options = { option1: 'value1' };

    // Mock getDataLoaderConfig to throw an error
    mockGetDataLoaderConfig.mockImplementation(() => {
      throw new Error('Test error');
    });

    // Create an instance of DataService
    const dataService = new DataService(mockGetDataLoaderConfig);

    // Act and Assert
    await expect(dataService.call(dataLoaderId, input, options)).rejects.toThrow('Test error');
  });
});