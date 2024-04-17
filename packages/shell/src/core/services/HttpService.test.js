import { HttpService } from './HttpService';
import axios from 'axios';

// Mock the Axios library
jest.mock('axios');

describe('HttpService', () => {
  // Before each test, reset the mocks
  beforeEach(() => {
    axios.mockReset();
  });

  it('should send an HTTP request using Axios and return the response', async () => {
    // Arrange
    const request = {
      method: 'GET',
      url: 'https://example.com/api/resource',
    };

    const responseData = {
      data: { id: 1, name: 'Resource Name' },
    };

    // Mock Axios to resolve with the expected response data
    axios.mockResolvedValue(responseData);

    // Act
    const response = await HttpService.send(request);

    // Assert
    expect(axios).toHaveBeenCalledWith(request);
    expect(response).toEqual(responseData);
  });

  it('should handle Axios request errors', async () => {
    // Arrange
    const request = {
      method: 'GET',
      url: 'https://example.com/api/resource',
    };

    const error = new Error('Network error');

    // Mock Axios to reject with an error
    axios.mockRejectedValue(error);

    // Act & Assert
    await expect(HttpService.send(request)).rejects.toThrow('Network error');
  });
});