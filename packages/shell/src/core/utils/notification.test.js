// Import necessary modules
import { NotificationUtil } from './notification'; // Adjust the import path
import { usePage } from '../providers/PageProvider';
import { useNotification } from '../providers';
import { useTranslation } from 'react-i18next';

// Mock the external hooks
jest.mock('../providers/PageProvider', () => ({
  usePage: jest.fn()
}));

jest.mock('../providers', () => ({
  useNotification: jest.fn()
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn()
}));

// jest.mock(Date.now, () => 1713333067077);

describe('NotificationUtil', () => {
  // Define mock functions for usePage and useNotification hooks
  const mockSetNotificationMessage = jest.fn();
  const mockShowToastMessage = jest.fn();
  const mockT = jest.fn((key, options) => key); // Mock translation function

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Mocking hooks return values
    usePage.mockReturnValue({ setNotificationMessage: mockSetNotificationMessage });
    useNotification.mockReturnValue({ showToastMessage: mockShowToastMessage });
    useTranslation.mockReturnValue({ t: mockT });
  });

  it('calls setNotificationMessage when type is banner', () => {
    const { showNotificationMessage } = NotificationUtil();
    // Define the expected message
    const kind = 'success';
    const type = 'banner';
    const message = 'Test message';

    const mockTimestamp = 1625140800000; // This is a specific timestamp for testing purposes
    jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
    // Calculate the expected ID based on the function logic
    const expectedId = `${mockTimestamp}${type}${kind}${message}`;

    // Invoke the function with type 'banner'
    showNotificationMessage(type, kind, message);

    // Assert that showToastMessage was called with the correct arguments
    expect(mockSetNotificationMessage).toHaveBeenCalledWith({
      id: expectedId, // Use the calculated expectedId
      kind: kind,
      role: 'status',
      title: 'Success',
      subtitle: 'Test message',
      caption: 'shell:notification.timestamp' // Adjust expected caption
    });
    Date.now.mockRestore();
  });

  it('calls showToastMessage when type is toast', () => {
    const { showNotificationMessage } = NotificationUtil();

    // Define the expected message
    const kind = 'error';
    const type = 'toast';
    const message = 'Test message';

    const mockTimestamp = 1625140800000; // This is a specific timestamp for testing purposes
    jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
    // Calculate the expected ID based on the function logic
    const expectedId = `${mockTimestamp}${type}${kind}${message}`;

    // Invoke the function with type 'toast'
    showNotificationMessage(type, kind, message);

    // Assert that showToastMessage was called with the correct arguments
    expect(mockShowToastMessage).toHaveBeenCalledWith({
      id: expectedId, // Use the calculated expectedId
      kind: kind,
      role: 'alert',
      title: 'Error',
      subtitle: message,
      caption: 'shell:notification.timestamp'
    });
  });

  it('logs an error message when type is invalid', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    const { showNotificationMessage } = NotificationUtil();

    // Invoke the function with an invalid type
    showNotificationMessage('invalidType', 'info', 'Test message');

    // Assert that an error message was logged to the console
    expect(consoleSpy).toHaveBeenCalledWith('Please pass valid notification type banner|toast');

    // Restore the original console.log function
    consoleSpy.mockRestore();
  });
});
