import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('should render the provided title and description', () => {
    const title = 'Test Title';
    const description = 'Test Description';

    const { getByText } = render(<PageHeader title={title} description={description} />);

    // Check if the title and description are rendered correctly
    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(description)).toBeInTheDocument();
  });

  it('should render a Layer element with the appropriate class name', () => {
    const title = 'Test Title';
    const description = 'Test Description';

    const { container } = render(<PageHeader title={title} description={description} />);

    // Check if a Layer element is present with the correct class name
    const layerElement = container.querySelector('.page-header-container');
    expect(layerElement).toBeInTheDocument();
  });

  it('should wrap the title in an h4 element and the description in a p element', () => {
    const title = 'Test Title';
    const description = 'Test Description';

    const { getByText } = render(<PageHeader title={title} description={description} />);

    // Check if the title is wrapped in an h4 element
    const titleElement = getByText(title);
    expect(titleElement.tagName).toBe('H4');

    // Check if the description is wrapped in a p element
    const descriptionElement = getByText(description);
    expect(descriptionElement.tagName).toBe('P');
  });
});
