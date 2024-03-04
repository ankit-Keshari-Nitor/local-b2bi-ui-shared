import { render, find, screen, fireEvent } from '@testing-library/react';
import { SFGEmptyState } from './EmptyState';
const fakeOnPrimaryAction = jest.fn((e) => {});
const fakeOnSecondaryAction = jest.fn((e) => {});
const mockData = {
  image: 'TestImage',
  title: 'Test Title',
  description: 'Test Description',
  primaryAction: 'Test Primary Action',
  onPrimaryAction: fakeOnPrimaryAction,
  secondaryAction: 'Test Secondary Action',
  onSecondaryAction: fakeOnSecondaryAction
};

describe('SFGEmptyState Component', () => {
  it('Verify that SFGEmptyState is rendered', async () => {
    const { container } = render(<SFGEmptyState {...mockData}></SFGEmptyState>);
    expect(container.getElementsByClassName('sfg--emptystate').length).toBe(1);
  });

  it('Verify that image is configurable', async () => {
    const { image, ...config } = mockData;
    const { container } = render(<SFGEmptyState {...mockData}></SFGEmptyState>);
    expect(container.getElementsByClassName('sfg--emptystate-image').length).toBe(1);

    const { container: container1 } = render(<SFGEmptyState {...config}></SFGEmptyState>);
    expect(container1.getElementsByClassName('sfg--emptystate-image').length).toBe(0);
  });

  it('Verify that title is configurable', async () => {
    const { title, ...config } = mockData;
    const { container } = render(<SFGEmptyState {...mockData}></SFGEmptyState>);
    expect(container.getElementsByClassName('sfg--emptystate-title').length).toBe(1);

    const { container: container1} = render(<SFGEmptyState {...config}></SFGEmptyState>);
    expect(container1.getElementsByClassName('sfg--emptystate-title').length).toBe(0);
  });

  it('Verify that description is configurable', async () => {
    const { description, ...config } = mockData;
    const { container } = render(<SFGEmptyState {...mockData}></SFGEmptyState>);
    expect(container.getElementsByClassName('sfg--emptystate-description').length).toBe(1);

    const { container: container1 } = render(<SFGEmptyState {...config}></SFGEmptyState>);
    expect(container1.getElementsByClassName('sfg--emptystate-description').length).toBe(0);
  });

  it('Verify that primaryAction is configurable', async () => {
    const { primaryAction, ...config } = mockData;
    const { container } = render(<SFGEmptyState {...mockData}></SFGEmptyState>);
    expect(container.getElementsByClassName('sfg--emptystate-primary-action').length).toBe(1);

    const { container: container1 } = render(<SFGEmptyState {...config}></SFGEmptyState>);
    expect(container1.getElementsByClassName('sfg--emptystate-primary-action').length).toBe(0);
  });

  it('Verify that secondaryAction is configurable', async () => {
    const { secondaryAction, ...config } = mockData;
    const { container } = render(<SFGEmptyState {...mockData}></SFGEmptyState>);
    expect(container.getElementsByClassName('sfg--emptystate-secondary-action').length).toBe(1);

    const { container: container1 } = render(<SFGEmptyState {...config}></SFGEmptyState>);
    expect(container1.getElementsByClassName('sfg--emptystate-secondary-action').length).toBe(0);
  });

  it('Verify that onPrimaryAction event is fired', async () => {
    const { container } = render(<SFGEmptyState {...mockData}></SFGEmptyState>);
    expect(container.getElementsByClassName('sfg--emptystate-primary-action-btn').length).toBe(1);
    fireEvent.click(container.getElementsByClassName('sfg--emptystate-primary-action-btn')[0]);
    expect(fakeOnPrimaryAction).toBeCalledTimes(1);
  });

  
  it('Verify that onPrimaryAction event is fired', async () => {
    const { container } = render(<SFGEmptyState {...mockData}></SFGEmptyState>);
    expect(container.getElementsByClassName('sfg--emptystate-secondary-action-link').length).toBe(1);
    fireEvent.click(container.getElementsByClassName('sfg--emptystate-secondary-action-link')[0]);
    expect(fakeOnSecondaryAction).toBeCalledTimes(1);
  });
});
