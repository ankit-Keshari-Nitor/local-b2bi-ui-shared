import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Loading } from '@carbon/react';
import { usePage } from '../../core/providers/PageProvider';
import { Page } from './Page';

jest.mock('../../core/providers/PageProvider', () => ({
  usePage: jest.fn(),
}));

describe('Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render children without loading overlay when there is no loading state', () => {
    // Mock usePage to return no loading state
    usePage.mockReturnValue({ loadingState: null });

    const { getByText, queryByText } = render(
      <Page type="DEFAULT">
        <div>Test Child</div>
      </Page>
    );

    // Check that the child is rendered
    expect(getByText('Test Child')).toBeInTheDocument();
    // Check that there is no loading overlay
    expect(queryByText('Loading initial page data')).not.toBeInTheDocument();
  });

  it('should render loading overlay when loadingState is set', () => {
    // Mock usePage to return a loading state
    usePage.mockReturnValue({ loadingState: 'init' });

    const { getByText } = render(
      <Page type="DEFAULT">
        <div>Test Child</div>
      </Page>
    );

    // Check that the child is rendered
    expect(getByText('Test Child')).toBeInTheDocument();
    // Check that the loading overlay with the correct description is rendered
    expect(getByText('Loading initial page data')).toBeInTheDocument();
  });

  it('should apply the correct class based on the type prop', () => {
    // Mock usePage to return no loading state
    usePage.mockReturnValue({ loadingState: null });

    const { container } = render(
      <Page type="LIST">
        <div>Test Child</div>
      </Page>
    );

    // Check that the class for the type is applied
    expect(container.firstChild).toHaveClass('page-type-list');
  });
});
