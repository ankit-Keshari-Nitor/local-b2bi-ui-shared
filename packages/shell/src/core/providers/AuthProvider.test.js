import { render, find, screen, fireEvent, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthProvider';
import { HttpService } from '../services/HttpService';

// Mock the HttpService and useEnvironment functions
jest.mock('../services/HttpService', () => ({
  HttpService: {
    send: jest.fn()
  }
}));

jest.mock('./EnvironmentProvider', () => ({
  useEnvironment: () => ({
    t: (key) => key,
    getEnvironmentValue: jest.fn()
  })
}));

const TestComponent = () => {
  const { signin, signout } = useAuth();

  const handleSignIn = async () => {
    await signin({ username: 'admin', password: 'password' });
  };
  const handleSignout = async () => {
    await signout();
  };
  return (
    <div>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleSignout}>Sign out</button>
    </div>
  );
};
test('should sign in a user', async () => {
  const response = {
    data: {
      authenticated: true
    }
  };
  HttpService.send.mockResolvedValue(response);

  render(
    <AuthProvider>
      <TestComponent></TestComponent>
    </AuthProvider>
  );
  act(() => {
    fireEvent.click(screen.getByText('Sign out'));
    fireEvent.click(screen.getByText('Sign In'));
  });

  expect(HttpService.send).toHaveBeenCalledTimes(1);
  expect(HttpService.send).toHaveBeenCalledWith({
    method: 'post',
    data: { username: 'admin', password: 'password' }
  });

  // You can also assert other things like checking if the user is set correctly

  // Cleanup
  jest.clearAllMocks();
});
/*
test('should handle rejected response', async () => {
  // Set up the mock rejected response
  const rejectedResponse = {
    response: { status: 500, message: 'Internal Server Error' }
  };

  // Set up the input data
  const newUser = { username: 'exampleUser', password: 'password' };

  // Mock the HttpService.send method to return the rejected response
  HttpService.send.mockRejectedValue(rejectedResponse);

  // Assert the expected behavior
  expect(HttpService.send).toHaveBeenCalledWith({
    url: 'URL',
    method: 'post',
    data: newUser
  });

  expect(console.error).toHaveBeenCalledWith(rejectedResponse);
});*/
