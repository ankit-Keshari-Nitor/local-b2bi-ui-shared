import React from 'react';
import { render } from '@testing-library/react';
import { DataServiceProvider } from '../../core/providers/DataServiceProvider';
import { useResource } from '../../core/providers/ResourceProvider';
import { RoutePage } from './RoutePage';

jest.mock('../../core/providers/ResourceProvider', () => ({
  useResource: jest.fn(),
}));

jest.mock('../../core/providers/DataServiceProvider', () => ({
  DataServiceProvider: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('RoutePage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the children wrapped in DataServiceProvider when user has access', () => {
    // Mock hasAccess to return true
    useResource.mockReturnValue({ hasAccess: jest.fn().mockReturnValue(true) });

    const { getByText } = render(
      <RoutePage dataLoaderConfig={{}} resourceKey="testResource">
        <div>Test Child</div>
      </RoutePage>
    );

    // Check that DataServiceProvider is rendered and contains the child
    expect(getByText('Test Child')).toBeInTheDocument();
    expect(DataServiceProvider).toHaveBeenCalledWith(
      expect.objectContaining({ config: {} }),
      expect.anything()
    );
  });

  it('should render "Not Authorised" when user does not have access', () => {
    // Mock hasAccess to return false
    useResource.mockReturnValue({ hasAccess: jest.fn().mockReturnValue(false) });

    const { getByText } = render(
      <RoutePage dataLoaderConfig={{}} resourceKey="testResource">
        <div>Test Child</div>
      </RoutePage>
    );

    // Check that "Not Authorised" is rendered
    expect(getByText('Not Authorised')).toBeInTheDocument();
  });
});
