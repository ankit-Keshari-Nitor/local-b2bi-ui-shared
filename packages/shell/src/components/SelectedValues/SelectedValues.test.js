import { render, find, screen, fireEvent } from '@testing-library/react';
import { SFGSelectedValues } from './SelectedValues';

const mockData = [{ id: 'test', displayValue: 'Test' }];

const fakeOnRemove = jest.fn((e) => {});
const fakeOnClearAll = jest.fn((e) => {});

describe('SFG Selected Values Component', () => {
  it('Verify that SFGSelectedValues is rendered', async () => {
    const { container } = render(<SFGSelectedValues name="TestSFGTreeView" className="TestClass" values={[]} onRemove={() => {}} onClearAll={() => {}}></SFGSelectedValues>);
    expect(container.getElementsByClassName('sfg--selected-values').length).toBe(1);
  });

  it('Verify that pills are rendered', async () => {
    const { container } = render(<SFGSelectedValues name="TestSFGTreeView" className="TestClass" values={mockData} onRemove={() => {}} onClearAll={() => {}}></SFGSelectedValues>);
    expect(container.getElementsByClassName('sfg--selected-values-pill').length).toBe(1);
  });

  it('Verify that clearAll are enbled/disabled based on data', async () => {
    const { container } = render(<SFGSelectedValues name="TestSFGTreeView" className="TestClass" values={mockData} onRemove={() => {}} onClearAll={() => {}}></SFGSelectedValues>);
    expect(container.getElementsByClassName('sfg--selected-values-clearall cds--link--disabled').length).toBe(0);

    const { container: container1 } = render(
      <SFGSelectedValues name="TestSFGTreeView" className="TestClass" values={[]} onRemove={() => {}} onClearAll={() => {}}></SFGSelectedValues>
    );
    expect(container1.getElementsByClassName('sfg--selected-values-clearall cds--link--disabled').length).toBe(1);
  });

  it('Verify that onClearAll event is fired', async () => {
    const { container } = render(<SFGSelectedValues name="TestSFGTreeView" className="TestClass" values={mockData} onRemove={fakeOnRemove} onClearAll={fakeOnClearAll}></SFGSelectedValues>);
    expect(container.getElementsByClassName('sfg--selected-values-clearall').length).toBe(1);

    fireEvent.click(container.getElementsByClassName('sfg--selected-values-clearall')[0]);
    expect(fakeOnClearAll).toBeCalledTimes(1);
  });

  it('Verify that onRemove event is fired', async () => {
    const { container } = render(
      <SFGSelectedValues name="TestSFGTreeView" className="TestClass" values={mockData} onRemove={fakeOnRemove} onClearAll={fakeOnClearAll}></SFGSelectedValues>
    );
    expect(container.getElementsByClassName('cds--tag__close-icon').length).toBe(1);
    fireEvent.click(container.getElementsByClassName('cds--tag__close-icon')[0]);
    expect(fakeOnRemove).toBeCalledTimes(1);
  });
});
