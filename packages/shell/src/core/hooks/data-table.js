import { useState, useRef } from 'react';

const useRefState = (intialValue) => {
  const refVar = useRef(intialValue);
  const [stateVar, setStateVar] = useState(intialValue);
  const setRefVar = (newValue) => {
    refVar.current = newValue;
    setStateVar(newValue);
  };
  return [refVar, stateVar, setRefVar];
};

const removeEmptyAttributes = function (obj) {
  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        const nestedObj = removeEmptyAttributes(obj[key]);
        if (Object.keys(nestedObj).length !== 0) {
          newObj[key] = nestedObj;
        }
      } else if (obj[key] !== '' && obj[key] !== undefined) {
        newObj[key] = obj[key];
      }
    }
  }
  return newObj;
};

const useDatatable = (tableConfig) => {
  const [loadingState, setLoadingState] = useState(false);
  const [filter, filterState, setFilter] = useRefState({});
  const [pagination, paginationState, setPagination] = useRefState();
  const [searchText, searchTextState, setSearchText] = useRefState();
  const [emptyState, setEmptyState] = useState();

  const _getListInput = function () {
    const listInput = {
      filter: filter.current,
      searchText: searchText.current,
      pagination: pagination.current
    };
    return tableConfig.processListInput ? tableConfig.processListInput(listInput) : listInput;
  };

  const getListData = () => {
    const dsPromise = tableConfig.getListData(_getListInput());
    if (dsPromise && typeof dsPromise.then === 'function') {
      setLoadingState(true);
      dsPromise
        .then((data) => {
          setLoadingState(false);
          _updateEmptyState(data);
        })
        .catch(() => {
          // TODO: Handle error and show empty state
          setLoadingState(false);
          _updateEmptyState({}, { error: 'dataFetchFailed' });
        });
    } else {
      console.error('getListData function did not return a promise or data');
      setLoadingState(false);
      _updateEmptyState({}, { error: 'dataFetchFailed' });
    }
    return dsPromise;
  };

  const getListItemDetails = (selectedItem) => {
    if (tableConfig.getListItemDetails) {
      const dsPromise = tableConfig.getListItemDetails(selectedItem);
      if (dsPromise && typeof dsPromise.then === 'function') {
        setLoadingState(true);
        dsPromise
          .then((data) => {
            setLoadingState(false);
            //_updateEmptyState(data);
          })
          .catch(() => {
            // TODO: Handle error and show empty state
            setLoadingState(false);
            //_updateEmptyState({}, { error: 'dataFetchFailed' });
          });
      } else {
        console.error('getListItemDetails function did not return a promise or data');
        setLoadingState(false);
        //_updateEmptyState({}, { error: 'dataFetchFailed' });
      }
      return dsPromise;
    } else {
      throw new Error('getListItemDetails is not defined for Datatable controller');
    }
  };

  const refresh = () => {
    return getListData();
  };

  const _updateEmptyState = function (tableData, errorObj) {
    if (errorObj) {
      setEmptyState(errorObj.error);
    } else {
      const listData = tableData.data.data;
      if (listData.length === 0) {
        const appliedFilterItems = removeEmptyAttributes(filter.current);
        if (Object.keys(appliedFilterItems).length > 0 || searchText.current) {
          setEmptyState('filterSearchNoData');
        } else {
          setEmptyState('initNoData');
        }
      } else {
        setEmptyState(undefined);
      }
    }
  };

  const applyFilter = function (filterData, reload = true) {
    setFilter(filterData);
    setPagination({
      ...pagination.current,
      page: 0
    });
    if (reload) {
      getListData();
    }
  };

  const removeFilter = function (filterItem) {
    delete filter[filterItem];
    setFilter(filter);
    setPagination({
      ...pagination.current,
      page: 0
    });
    getListData();
  };

  const clearFilter = function () {
    setFilter({});
    setPagination({
      ...pagination.current,
      page: 0
    });
    getListData();
  };

  const search = function (searchText) {
    setSearchText(searchText);
    setPagination({
      ...pagination.current,
      page: 0
    });
    getListData();
  };

  const clearSearch = function () {
    setSearchText('');
    setPagination({
      ...pagination.current,
      page: 0
    });
    getListData();
  };

  const reset = function () {
    // TODO: Reset is not resetting the applier fitlers and search
    setFilter({});
    setSearchText('');
    setPagination({
      ...pagination.current,
      page: 0
    });
    getListData();
  };

  const paginationChange = function (paginationConfig, reload = true) {
    setPagination(paginationConfig);
    if (reload) {
      getListData();
    }
  };

  const loadRowDetails = function (selectedRow) {
    return getListItemDetails(selectedRow);
  };

  const init = function () {
    getListData();
  };

  return {
    loadingState,
    applyFilter,
    clearFilter,
    search,
    clearSearch,
    reset,
    removeFilter,
    paginationChange,
    refresh,
    init,
    filter: filter,
    filterState,
    pagination: pagination,
    paginationState,
    searchText: searchText,
    searchTextState,
    emptyState,
    loadRowDetails
  };
};

export { useDatatable };
