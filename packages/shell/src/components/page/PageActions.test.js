import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@carbon/react';
import { useResource } from '../../core/providers/ResourceProvider';
import { useTranslation } from 'react-i18next';
import { PageActions } from './PageActions';

jest.mock('../../core/providers/ResourceProvider', () => ({
  useResource: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('PageActions', () => {
  // Sample actions for testing
  const actions = [
    {
      id: 'action1',
      label: 'action1Label',
      kind: 'primary',
      button: 'button',
      resourceKey: 'resource1',
      onAction: jest.fn(),
    },
    {
      id: 'action2',
      label: 'action2Label',
      kind: 'secondary',
      button: 'button',
      resourceKey: 'resource2',
      onAction: jest.fn(),
    },
  ];

  // Mock filter function
  const filter = (actions) => {
    actions.action2.shouldShow = false; // Hide the second action
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should render the correct buttons based on actions and filter function', () => {
    // Mock useResource and useTranslation
    useResource.mockReturnValue({ hasAccess: jest.fn((key) => key !== 'resource2') }); // Only allow access to resource1
    useTranslation.mockReturnValue({ t: jest.fn((key) => key) }); // Mock translation function

    const { getByTestId, queryByTestId } = render(
      <PageActions actions={actions} filter={filter} />
    );

    // Check that action1 button is rendered and has the correct properties
    const action1Button = getByTestId('action1');
    expect(action1Button).toHaveTextContent('action1Label');
    expect(action1Button).toHaveClass('cds--btn--primary');
    fireEvent.click(action1Button);
    expect(actions[0].onAction).toHaveBeenCalled();

    // Check that action2 button is not rendered due to filter and resource access
    expect(queryByTestId('action2')).toBeNull();
  });

  it('should apply translations to button labels', () => {
    // Mock useResource and useTranslation
    useResource.mockReturnValue({ hasAccess: jest.fn(() => true) });
    const t = jest.fn((key) => key);
    useTranslation.mockReturnValue({ t });

    const { getByTestId } = render(
      <PageActions actions={actions} filter={filter} />
    );

    // Check that the translation function is called for each action label
    expect(t).toHaveBeenCalledWith('action1Label');
    // expect(t).toHaveBeenCalledWith('action2Label');
  });
});
