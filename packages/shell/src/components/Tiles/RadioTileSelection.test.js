import { render, find, screen, fireEvent } from '@testing-library/react';
import { SFGRadioTileSelection } from './RadioTileSelection';

const mockData = [{ id: 'test1', label: 'Test1', description:"Test description 1 " },
{ id: 'test2', label: 'Test2', description:"Test description 2 " },
{ id: 'test3', label: 'Test3', description:"Test description 3 " },
{ id: 'test4', label: 'Test4', description:"Test description 4 " }];

const fakeOnSelect = jest.fn((e) => {});

describe('SFGRadioTileSelection Component', () => {
  it('Verify that SFGRadioTileSelection is rendered', async () => {
    const { container } = render(<SFGRadioTileSelection name="TestSFGTreeView" className="TestClass" options={mockData} onSelect={fakeOnSelect}></SFGRadioTileSelection>);
    expect(container.getElementsByClassName('sfg--radio-selection-tile-group').length).toBe(1);
  });

  
  it('Verify that onSelect event is fired', async () => {
    const { container } = render(<SFGRadioTileSelection name="TestSFGTreeView" className="TestClass" options={mockData} onSelect={fakeOnSelect}></SFGRadioTileSelection>);
    expect(container.getElementsByClassName('cds--tile-input').length).toBe(4);
    fireEvent.click(container.getElementsByClassName('cds--tile-input')[1]);
    expect(fakeOnSelect).toBeCalledTimes(1);
  });
});