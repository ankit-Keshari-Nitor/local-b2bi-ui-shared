import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Import for extra matchers
import { NotificationProvider, useNotification } from './NotificationProvider'; // Adjust the import path

describe('NotificationProvider and useNotification', () => {
  // Test to check if the NotificationProvider renders children and provides context values
  it('provides context values and renders children', () => {
    // Create a mock child component
    const TestChild = () => {
      const { showToastMessage, closeToastMessage, toastMessage } = useNotification();

      // Assert that the context values are available
      expect(showToastMessage).toBeDefined();
      expect(closeToastMessage).toBeDefined();
      expect(toastMessage).toBeDefined();

      return <div>Test Child</div>;
    };

    // Render the NotificationProvider with the TestChild component as children
    render(
      <NotificationProvider>
        <TestChild />
      </NotificationProvider>
    );

    // Assert that the TestChild component is rendered
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  // Test to check if showToastMessage and closeToastMessage work correctly
  it('handles showToastMessage and closeToastMessage functions', async () => {
    // Create a test message object
    const testMessage = {
      id: 1,
      content: 'Test message'
    };

    const testFn = {};

    // Create a mock child component
    const TestChild = () => {
      const { showToastMessage, closeToastMessage, toastMessage } = useNotification();

      testFn.testShowToastMessage = async () => {
        await waitFor(() => {
          // Use showToastMessage to add the test message
          showToastMessage(testMessage);
        });
      };

      testFn.testToastMessageOnShow = async () => {
        await waitFor(() => {
          // Assert that the toastMessage state contains the test message
          expect(toastMessage).toEqual([testMessage]);
        });
      };

      testFn.testCloseToastMessage = async () => {
        await waitFor(() => {
          // Use closeToastMessage to remove the test message
          closeToastMessage(testMessage.id);
        });
        
      };

      testFn.testToastMessageOnClose = async () => {
        await waitFor(() => {
          // Assert that the toastMessage state does not contain the test message
        expect(toastMessage).not.toEqual([testMessage]);
        });
      };

      return <div>Test Child</div>;
    };

    // Render the NotificationProvider with the TestChild component as children
    render(
      <NotificationProvider>
        <TestChild />
      </NotificationProvider>
    );

    await testFn.testShowToastMessage();
    await testFn.testToastMessageOnShow();
    await testFn.testCloseToastMessage();
    await testFn.testToastMessageOnClose();
  });
});
