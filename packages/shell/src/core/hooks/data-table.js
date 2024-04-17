import { useState, useRef } from 'react';

const useRefState = (intialValue) => {
  const refVar = useRef();
  const setRefVar = (newValue) => {
    refVar.current = newValue;
  };
  return [refVar, setRefVar];
};

const useDatatable = (tableConfig) => {
  const [loadingState, setLoadingState] = useState(false);
  const [filter, setFilter] = useRefState();
  const [pagination, setPagination] = useRefState();
  const [searchText, setSearchText] = useRefState();

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
      dsPromise.then(() => {
        setLoadingState(false);
      }).catch(() => {
        // TODO: Handle error and show empty state
        setLoadingState(false);
      });
    } else {
      console.error('getListData function did not return a promise');
      setLoadingState(false);
    }
    return dsPromise;
  };

  const refresh = () => {
    return getListData();
  };

  const applyFilter = function (filterData) {
    setFilter(filterData);
    setPagination({
      ...pagination.current,
      page: 0
    });
    getListData();
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
    init
  };
};

export { useDatatable };
