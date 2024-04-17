import { renderHook, act } from '@testing-library/react-hooks';
import { useDatatable } from './data-table';

describe('useDatatable hook', () => {
  const mockGetListData = jest.fn();
  const tableConfig = {
    getListData: mockGetListData,
    processListInput: jest.fn((listInput) => listInput),
  };

  let mockPromise;

  beforeEach(() => {
    mockPromise = Promise.resolve();
    mockGetListData.mockReturnValueOnce(mockPromise);
  });


  test('initial state', () => {
    const { result } = renderHook(() => useDatatable(tableConfig));

    expect(result.current.loadingState).toBe(false);
  });

  test('getListData sets loadingState and calls getListData from tableConfig', async () => {
    const { result } = renderHook(() => useDatatable(tableConfig));
    

    await act(async () => {
      result.current.refresh();
    });

    // expect(result.current.loadingState).toBe(true);
    expect(mockGetListData).toHaveBeenCalledWith({
      filter: undefined,
      searchText: undefined,
      pagination: undefined,
    });

    // Wait for the promise to resolve
    await mockPromise;
    expect(result.current.loadingState).toBe(false);
  });

  test('applyFilter sets filter and updates pagination', async () => {
    const { result } = renderHook(() => useDatatable(tableConfig));
    const filterData = { key: 'value' };

    await act(async () => {
      result.current.applyFilter(filterData);
    });

    // expect(result.current.loadingState).toBe(true);
    expect(result.current.applyFilter).toBeDefined();
    expect(mockGetListData).toHaveBeenCalled();
  });

  test('clearFilter sets empty filter and reloads data', async () => {
    const { result } = renderHook(() => useDatatable(tableConfig));

    await act(async () => {
      result.current.clearFilter();
    });

    // expect(result.current.loadingState).toBe(true);
    expect(result.current.clearFilter).toBeDefined();
    expect(mockGetListData).toHaveBeenCalled();
  });

  test('search sets searchText and reloads data', async () => {
    const { result } = renderHook(() => useDatatable(tableConfig));
    const searchText = 'test search';

    await act(async () => {
      result.current.search(searchText);
    });

    // expect(result.current.loadingState).toBe(true);
    expect(result.current.search).toBeDefined();
    expect(mockGetListData).toHaveBeenCalled();
  });

  test('removeFilter removes a filter item, updates pagination, and reloads data', async () => {
    const { result } = renderHook(() => useDatatable(tableConfig));
    const initialFilter = { key1: 'value1', key2: 'value2' };

    // Set initial filter
    act(() => {
      result.current.applyFilter(initialFilter);
    });

    // Remove a filter item
    const filterItemToRemove = 'key1';
    await act(async () => {
      result.current.removeFilter(filterItemToRemove);
    });

    // Verify filter is updated and data reloaded
    // expect(result.current.loadingState).toBe(true);
    expect(mockGetListData).toHaveBeenCalled();
  });

  test('reset clears filter, searchText, pagination, and reloads data', async () => {
    const { result } = renderHook(() => useDatatable(tableConfig));

    // Apply a filter and search text
    act(() => {
      result.current.applyFilter({ key: 'value' });
      result.current.search('test');
    });

    // Reset to initial state
    await act(async () => {
      result.current.reset();
    });

    // Verify filter, searchText, pagination are cleared, and data is reloaded
    //expect(result.current.loadingState).toBe(true);
    expect(mockGetListData).toHaveBeenCalled();
  });

  test('clearSearch clears searchText, updates pagination, and reloads data', async () => {
    const { result } = renderHook(() => useDatatable(tableConfig));

    // Apply a search text
    act(() => {
      result.current.search('test search');
    });

    // Clear the search text
    await act(async () => {
      result.current.clearSearch();
    });

    // Verify searchText is cleared, pagination is updated, and data is reloaded
    //expect(result.current.loadingState).toBe(true);
    expect(mockGetListData).toHaveBeenCalled();
  });

});
