import React, { useState, useEffect } from 'react';
import {
  Button,
  DataTable,
  DataTableSkeleton,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableBatchActions,
  TableBatchAction,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  TableToolbarAction,
  TableSelectAll,
  TableSelectRow
} from '@carbon/react';
import { Filter } from '@carbon/icons-react';
import { useTranslation } from 'react-i18next';
import { useResource } from '../../core/providers/ResourceProvider';
import DataTableFilter from './DataTableFilter';
import TransformTableData from './transform-table-data';
import { Grid, Column, Tag, Link } from '@carbon/react';
import { SFGEmptyState } from '../EmptyState/EmptyState';
import './DataTable.scss';

// const rowSelect = ['none', 'single', 'multiple', 'all'];

const arrayToObject = (array, objectKey) => {
  return Object.fromEntries(array.map((obj) => [obj[objectKey], obj]));
};

const getSelectedRowData = (selectedRows, rowObj) => {
  const selectedRowData = [];
  selectedRows.forEach((selectedRow) => {
    selectedRowData.push(rowObj[selectedRow.id]);
  });
  return selectedRowData;
};

const filterActions = (selectedRows, actions, filterFn) => {
  actions.forEach((action) => {
    action.shouldShow = true;
  });
  const actionsObj = Object.fromEntries(actions.map((obj) => [obj.id, obj]));
  selectedRows.forEach((selectedRow) => {
    if (filterFn !== undefined) {
      filterFn(selectedRow, actionsObj);
    }
  });
  actions.forEach((action) => {
    if (action.selection === 'single' && selectedRows.length > 1) {
      action.shouldShow = false;
    }
  });
  return actions;
};

const SFGDataTable = ({ data, totalItems, controller, config, className, emptyState, loadingState, ...props }) => {
  const [showFilter, setShowFilter] = useState(false);
  const { t } = useTranslation();
  const { hasAccess } = useResource();
  const [rows, setRows] = useState([]);
  const [rowObj, setRowObj] = useState({});
  const [headerData, setHeaderData] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [appliedFilter, setAppliedFilter] = useState([]);
  const [appliedFilterDisplay, setAppliedFilterDisplay] = useState();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: config.paginationConfig.pageSize || 20
  });

  const paginate = (data, { page, pageSize }) => {
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    return data.slice(start, end);
  };

  useEffect(() => {
    setRowObj(arrayToObject(data, 'id'));
    if (config.paginationConfig.mode === 'client' || config.paginationConfig.mode === undefined) {
      setRows(paginate(TransformTableData(data, config.columnConfig, t), pagination));
    } else if (config.paginationConfig.mode === 'server' || config.paginationConfig.mode === 'mixed') {
      setRows(TransformTableData(data, config.columnConfig, t));
    }
  }, [data]);

  useEffect(() => {
    if (config.paginationConfig.mode === 'client' || config.paginationConfig.mode === undefined) {
      setRows(paginate(TransformTableData(data, config.columnConfig, t), pagination));
    } else if (config.paginationConfig.mode === 'server') {
      config.paginationConfig.onChange({ page: pagination.page - 1, pageSize: pagination.pageSize });
    } else if (config.paginationConfig.mode === 'mixed') {
      config.paginationConfig.onChange({ page: pagination.page - 1, pageSize: pagination.pageSize });
    }
  }, [pagination]);

  useEffect(() => {
    setHeaderData(
      config.columnConfig.map((column) => {
        return {
          header: t(column.label),
          key: column.value
        };
      })
    );
  }, [config]);

  useEffect(() => {
    setAppliedFilterDisplay(renderAppliedFilterTags());
    pagination.page = 1;
  }, [appliedFilter]);

  const renderAppliedFilterTags = () => {
    const applicableFilter = Object.entries(appliedFilter).filter(([_, value]) => value !== '' && value !== null && value.length > 0);
    if (applicableFilter.length > 0) {
      const appliedFilterDisplay = applicableFilter.map(([key, value]) => {
        const filterItem = config.filterConfig.fields.find((item) => {
          return item.name === key;
        });
        let displayValue;
        if (filterItem.type === 'checkbox-group') {
          const filteredOptions = filterItem.options.filter((optionItem) => {
            return value.find((val) => val === optionItem.value);
          });
          displayValue = filteredOptions
            .map((option) => {
              return option.label.indexOf(':') > -1 ? t(option.label) : option.label;
            })
            .toString();
        } else if (filterItem.type === 'radio-group') {
          const filteredOptions = filterItem.options.filter((optionItem) => {
            return value === optionItem.value;
          });
          displayValue = filteredOptions
            .map((option) => {
              return option.label.indexOf(':') > -1 ? t(option.label) : option.label;
            })
            .toString();
        }else {
          displayValue = value;
        }
        if (displayValue.indexOf(':') > -1) {
          displayValue = t(displayValue);
        }
        return (
          <Tag
            key={key}
            type="blue"
            data-testid={'tag-' + key}
            className="sfg--applied-filter-section-pills"
            filter
            title="Clear Filter"
            size="md"
            name={filterItem.name}
            onClose={() => {
              //delete appliedFilter[key];
              const { [key]: removedData, ...filterData } = appliedFilter;
              filterData[key] = '';
              setAppliedFilter(filterData);
              config?.filterConfig?.onApply?.(filterData);
              //config?.filterConfig?.onRemove(key);
            }}
          >
            {t(filterItem.label)}:{displayValue}{' '}
          </Tag>
        );
      });
      return (
        <>
          {appliedFilterDisplay}

          <Link
            size="sm"
            onClick={() => {
              setAppliedFilter({});
              config?.filterConfig?.onClear();
            }}
          >
            {t('shell:common.filter-section.clear-filter')}
          </Link>
        </>
      );
    } else {
      return <></>;
    }
  };

  useEffect(() => {
    /*if (controller) {
      //controller.init();
      controller.onPaginationChange({ page: pagination.page - 1, pageSize: pagination.pageSize });
    }*/
    setPagination({
      page: 1,
      pageSize: config.paginationConfig.pageSize || 20
    });
  }, []);

  return (
    <>
      {loadingState ? (
        <DataTableSkeleton headers={headerData} columnCount={headerData.length} showHeader={config.title ? true : false} rowCount={20}></DataTableSkeleton>
      ) : (
        <>
          <DataTable rows={rows} headers={headerData} data-testid="data-table">
            {({ rows, headers, getHeaderProps, getRowProps, getSelectionProps, getBatchActionProps, onInputChange, selectedRows }) => (
              <TableContainer title={config.title ? config.title : ''} description={config.description ? config.description : ''} className={'sfg--table-container ' + className}>
                <TableToolbar>
                  <TableBatchActions {...getBatchActionProps()} data-testid="batchAction">
                    {config.actionsConfig.batchActions &&
                      selectedRows.length > 0 &&
                      filterActions(getSelectedRowData(selectedRows, rowObj), config.actionsConfig.batchActions, config.actionsConfig.filterBatchActions)
                        .filter((batchAction) => hasAccess(batchAction.resourceKey))
                        .filter((batchAction) => batchAction.shouldShow)
                        .map((batchAction) => (
                          <TableBatchAction
                            key={batchAction.label}
                            data-testid={batchAction.id}
                            tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                            renderIcon={batchAction.icon}
                            onClick={() => batchAction.onAction(selectedRows)}
                          >
                            {t(batchAction.label)}
                          </TableBatchAction>
                        ))}
                  </TableBatchActions>
                  <TableToolbarContent className="sfg--table-toolbar ">
                    {config?.filterConfig?.fields && (
                      <Button kind="ghost" data-testid="filtericon" name="filter" aria-label="filter-btn" onClick={() => (showFilter ? setShowFilter(false) : setShowFilter(true))}>
                        <Filter></Filter>
                      </Button>
                    )}
                    {config?.actionsConfig?.search && (
                      <TableToolbarSearch
                        data-testid="toolbarsreach"
                        placeholder={t(config.actionsConfig.search.label)}
                        tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                        defaultValue={searchText}
                        //onChange={(event) => {
                        //  config.actionsConfig.search.onAction(event) || onInputChange(event);
                        //}}

                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            if (config.actionsConfig.search.onAction !== undefined) {
                              config.actionsConfig.search.onAction(event.target?.value);
                            } else {
                              onInputChange(event);
                            }
                            pagination.page = 1;
                            setSearchText(event.target?.value);
                          }
                        }}
                        onClear={() => {
                          pagination.page = 1;
                          controller.clearSearch();
                          setSearchText('');
                        }}
                        persistent
                      />
                    )}
                    {config.toolbarMenu ? (
                      <TableToolbarMenu tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}>
                        {config.toolbarMenu.map((menuItem, index) => (
                          <TableToolbarAction key={index} primaryFocus={index === 0} onClick={() => menuItem.onAction(selectedRows)}>
                            {menuItem.label}
                          </TableToolbarAction>
                        ))}
                      </TableToolbarMenu>
                    ) : (
                      <></>
                    )}
                    {config.actionsConfig?.toolbarActions &&
                      config.actionsConfig?.toolbarActions
                        .filter((toolbarAction) => hasAccess(toolbarAction.resourceKey))
                        .map((toolbarAction, index) => (
                          <Button
                            key={toolbarAction.id}
                            data-testid={toolbarAction.id}
                            name={toolbarAction.id}
                            onClick={() => toolbarAction.onAction()}
                            renderIcon={toolbarAction.icon}
                            isSelected={toolbarAction.isSelected}
                            iconDescription={t(toolbarAction.label)}
                            hasIconOnly={toolbarAction.iconOnly}
                            // size="sm"
                            kind={toolbarAction.kind}
                          >
                            {!toolbarAction.iconOnly && t(toolbarAction.label)}
                          </Button>
                        ))}
                    {config.actionsConfig.primary && hasAccess(config.actionsConfig.primary.resourceKey) && (
                      <Button
                        data-testid={config.actionsConfig.primary.id}
                        name={config.actionsConfig.primary.id}
                        tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                        onClick={() => config.actionsConfig.primary.onAction()}
                        renderIcon={config.actionsConfig.primary.icon}
                        // size="sm"
                        kind={config.actionsConfig.primary.kind}
                      >
                        {t(config.actionsConfig.primary.label)}
                      </Button>
                    )}
                  </TableToolbarContent>
                </TableToolbar>
                <Grid fullWidth className="sfg--datatable-container-grid">
                  {showFilter && (
                    <Column lg={4} className="sfg--datatable-container-grid-col sfg--filter-section">
                      <DataTableFilter
                        defaultValues={config?.filterConfig?.defaultValues}
                        filterList={config?.filterConfig?.fields}
                        values={appliedFilter}
                        onApply={(data) => {
                          setAppliedFilter(data);
                          config?.filterConfig?.onApply?.(data);
                          setShowFilter(false);
                        }}
                        onCancel={() => {
                          setShowFilter(false);
                          config?.filterConfig?.onCancel();
                        }}
                        onClear={() => {
                          setAppliedFilter({});
                          config?.filterConfig?.onClear();
                        }}
                      ></DataTableFilter>
                    </Column>
                  )}
                  <Column className="sfg--datatable-container-grid-col sfg--datatable-right-section" lg={showFilter ? 12 : 16}>
                    <div className="sfg--datatable-applied-filters-section">{appliedFilter && appliedFilterDisplay}</div>
                    <div className="sfg--datatable-table-section">
                      <Table>
                        <TableHead className="sfg--data-table-head">
                          <TableRow>
                            {config?.rowConfig?.select !== 'none' &&
                              (['all'].includes(config?.rowConfig?.select) ? (
                                <TableSelectAll {...getSelectionProps()} data-testid="row-selection" />
                              ) : (
                                <th scope="col" data-testid="row-selection"></th>
                              ))}
                            {headers.map((header, index) => (
                              <TableHeader key={index} data-testid={header.key} {...getHeaderProps({ header })}>
                                {header.header}
                              </TableHeader>
                            ))}
                            {config?.actionsConfig.rowActions && <TableHeader data-testid="row-actions" />}
                          </TableRow>
                        </TableHead>
                        {!(emptyState !== undefined && config.emptyStateConfig !== undefined) && (
                          <TableBody>
                            {rows.map((row, i) => (
                              <TableRow key={i} {...getRowProps({ row })} data-testid={'row-' + i}>
                                {['multiple', 'all'].includes(config?.rowConfig?.select) && <TableSelectRow data-testid="row-selection" {...getSelectionProps({ row })} />}
                                {row.cells.map((cell) => (
                                  <TableCell key={cell.id} data-testid={cell.id}>
                                    {cell.value}
                                  </TableCell>
                                ))}
                                {config?.actionsConfig.rowActions && (
                                  <TableCell data-testid="row-actions">
                                    <OverflowMenu size="sm" flipped data-testid={'overflow-' + i}>
                                      {filterActions(getSelectedRowData([row], rowObj), config.actionsConfig.rowActions, config.actionsConfig.filterRowActions)
                                        .filter((rowAction) => rowAction.shouldShow)
                                        .filter((rowAction) => hasAccess(rowAction.resourceKey))
                                        .map((rowAction) => (
                                          <OverflowMenuItem
                                            data-testid={rowAction.id}
                                            key={rowAction.id}
                                            itemText={t(rowAction.label)}
                                            onClick={() => rowAction.onAction({ id: data.userKey || row.id })}
                                          />
                                        ))}
                                    </OverflowMenu>
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        )}
                      </Table>
                      {emptyState !== undefined && config.emptyStateConfig !== undefined && (
                        <SFGEmptyState type="datatable" {...config.emptyStateConfig[emptyState]}></SFGEmptyState>
                      )}
                    </div>
                    {config.paginationConfig && (
                      <Pagination
                        data-testid="table-pagination"
                        backwardText={t('common:pagination.backwardText')}
                        forwardText={t('common:pagination.forwardText')}
                        itemsPerPageText={t('common:pagination.itemsPerPageText')}
                        onChange={({ page, pageSize }) => {
                          setPagination({ page, pageSize });
                        }}
                        page={pagination.page}
                        pageNumberText={t('common:pagination.pageNumberText')}
                        pageSize={pagination.pageSize}
                        pageSizes={config.paginationConfig?.pageSizes || [5, 10, 20, 40, 50]}
                        totalItems={totalItems || data.length}
                        size={'lg'}
                      />
                    )}
                  </Column>
                </Grid>
              </TableContainer>
            )}
          </DataTable>
        </>
      )}
    </>
  );
};
export { SFGDataTable };
