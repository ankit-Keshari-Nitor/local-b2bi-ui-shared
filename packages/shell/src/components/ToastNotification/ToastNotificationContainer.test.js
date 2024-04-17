import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Import for extra matchers
import ToastNotificationContainer from './ToastNotificationContainer'; // Import the component
import { useNotification } from '../../core'; // Import the custom hook
import { useTranslation } from 'react-i18next'; // Import the translation hook

// Mocking the custom hooks
jest.mock('../../core', () => ({
  useNotification: jest.fn()
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn()
}));

describe('ToastNotificationContainer', () => {
  let mockToastMessage;
  let mockCloseToastMessage;
  let mockT;

  beforeEach(() => {
    // Reset mocks before each test
    mockToastMessage = [
      {
        id: 1,
        caption: 'Caption 1',
        kind: 'info',
        role: 'alert',
        subtitle: 'Subtitle 1',
        title: 'Title 1'
      }
    ];
    mockCloseToastMessage = jest.fn();
    mockT = jest.fn().mockImplementation((key) => key); // Mock the translation function

    // Mock the useNotification hook
    useNotification.mockReturnValue({
      toastMessage: mockToastMessage,
      closeToastMessage: mockCloseToastMessage
    });

    // Mock the useTranslation hook
    useTranslation.mockReturnValue({ t: mockT });
  });

  afterEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  it('renders ToastNotificationContainer and shows notifications', () => {
    // Render the component
    render(<ToastNotificationContainer />);

    // Assert that the notification is rendered
    const notification = screen.getByText('Title 1');
    expect(notification).toBeInTheDocument();

    // Assert that other properties of the notification are rendered correctly
    expect(screen.getByText('Caption 1')).toBeInTheDocument();
    expect(screen.getByText('Subtitle 1')).toBeInTheDocument();
  });

  it('calls closeToastMessage when notification close button is clicked', () => {
    // Render the component
    render(<ToastNotificationContainer />);

    // Find the close button and simulate a click event
    const closeButton = screen.getByLabelText('shell:notification.close_arialabel');
    fireEvent.click(closeButton);

    // Assert that closeToastMessage was called with the correct ID
    expect(mockCloseToastMessage).toHaveBeenCalledWith(1);
  });
});
