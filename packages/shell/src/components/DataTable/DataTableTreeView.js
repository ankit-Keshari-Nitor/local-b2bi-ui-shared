import React, { useState } from 'react';
import { Button, Column, Grid, Layer, TableContainer, TableToolbar, TableToolbarContent, TableToolbarSearch } from '@carbon/react';
import { Filter } from '@carbon/icons-react';
import AppliedFilter from './AppliedFilter';
import { SFGTreeView as TreeView } from '../TreeView/SFGTreeView';
import { SFGEmptyState as EmptyState } from '../EmptyState/EmptyState';
import { DataTableFilter as DataFilter } from './DataTableFilter';
import { useTranslation } from 'react-i18next';
import { useResource } from '../../core/providers/ResourceProvider';
import './DataTableTreeView.scss';

const DataTableTreeView = ({ config, emptyState, treeData, children, detailView, ...props }) => {
  const { t } = useTranslation();
  const { hasAccess } = useResource();
  const [showFilter, setShowFilter] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [appliedFilter, setAppliedFilter] = useState([]);
  const [selectedTreeData, setSelectedTreeData] = useState(undefined);

  const onRemoveAppliedFilter = (key) => {
    const { [key]: removedData, ...filterData } = appliedFilter;
    filterData[key] = '';
    setAppliedFilter(filterData);
    config?.filterConfig?.onApply?.(filterData);
  };

  const onClearApplierFilter = () => {
    setAppliedFilter({});
    config?.filterConfig?.onClear();
  };

  const tempOnSelect = config.treeView.onSelect;
  config.treeView.onSelect = (...args) => {
    setSelectedTreeData(args[1].id);
    tempOnSelect(...args);
  }
  return (
    <>
      <TableContainer className="sfg--datatable-treeview-container">
        <TableToolbar>
          <TableToolbarContent>
            {config?.filterConfig?.fields && (
              <Button kind="ghost" data-testid="filtericon" name="filter" aria-label="filter-btn" onClick={() => (showFilter ? setShowFilter(false) : setShowFilter(true))}>
                <Filter></Filter>
              </Button>
            )}

            <TableToolbarSearch
              data-testid="toolbarsreach"
              placeholder={t(config.actionsConfig.search.label)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  if (config.actionsConfig.search.onAction !== undefined) {
                    config.actionsConfig.search.onAction(event);
                  } else {
                    // onInputChange(event);
                  }
                }
              }}
              // onClear={() => controller.onClearSearch()}
              persistent
            />
            {config.actionsConfig?.toolbarActions &&
              config.actionsConfig?.toolbarActions
                .filter((toolbarAction) => toolbarAction.isVisible || toolbarAction.isVisible === undefined)
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
                tabIndex={0}
                onClick={() => config.actionsConfig.primary.onAction()}
                renderIcon={config.actionsConfig.primary.icon}
                disabled={config?.actionsConfig?.primary?.disabled}
                // size="sm"
                kind={config.actionsConfig.primary.kind}
              >
                {t(config.actionsConfig.primary.label)}
              </Button>
            )}
          </TableToolbarContent>
        </TableToolbar>
        <Grid fullWidth className="sfg--datatable-treeview-container-grid">
          {showFilter && (
            <Column lg={4} className="sfg--treeview-container-grid-col sfg--treeview-filter-section">
              <DataFilter
                defaultValues={config?.filterConfig?.defaultValues}
                filterList={config?.filterConfig?.fields}
                values={appliedFilter}
                onApply={(data) => {
                    setAppliedFilter(data);
                  config?.filterConfig?.onApply?.(data);
                }}
                onCancel={() => {
                  config?.filterConfig?.onCancel();
                }}
                onClear={() => {
                    setAppliedFilter({});
                  config?.filterConfig?.onClear();
                }}
              ></DataFilter>
            </Column>
          )}
          <Column lg={showFilter ? 12 : 16} className="sfg--treeview-container-grid-col">
            <div className="sfg--datatable-treeview--content">
              <div className="sfg--datatable-applied-filters-section">
                {appliedFilter && (
                  <AppliedFilter appliedFilter={appliedFilter} filterConfig={config.filterConfig} onRemoveFilter={onRemoveAppliedFilter} onClearFilter={onClearApplierFilter} />
                )}
              </div>
              <div className="sfg--datatable-treeview--header-container">
                <div className="sfg--datatable-treeview--header">
                  <span>{t(config.treeView?.label)}</span>
                </div>
                <div className="sfg--datatable-treeview--header">
                  <span>{t(config.detailView?.label)}</span>
                </div>
              </div>
              <div className="sfg--datatable-treeview--body-container">
                <div className="sfg--datatable-treeview--section">
                  <TreeView name="resourceTree" data={treeData} config={config} selected={selectedTreeData}></TreeView>
                </div>
                <div className="sfg--datatable-treeview--section">
                  {selectedTreeData !== undefined ? (
                    <div className="sfg--business-unit-detail-container sfg--tree-view-border">
                      <config.detailView.element inputKey={selectedTreeData}></config.detailView.element>
                    </div>
                  ) : (
                    <>
                      <EmptyState className="sfg-tree-view-emptystate" {...config.emptyStates[emptyState]}></EmptyState>
                    </>
                  )}
                </div>
              </div>
              {/*<Grid condensed className="sfg--datatable-treeview--header-container">
                <Column lg={showFilter ? 6 : 8} md={showFilter ? 6 : 8} className="sfg--datatable-treeview--header">
                  <span>{t(config.treeView?.label)}</span>
                </Column>
                <Column lg={showFilter ? 6 : 8} md={showFilter ? 6 : 8} className="sfg--datatable-treeview--header">
                  <span>{t(config.detailView?.label)}</span>
                </Column>
              </Grid>
              <Grid condensed className="sfg--datatable-treeview--body-container">
                <Column lg={showFilter ? 6 : 8} md={showFilter ? 6 : 8} className="sfg--datatable-treeview--section">
                  <TreeView name="resourceTree" data={treeData} config={config} selected={selectedTreeData}></TreeView>
                </Column>
                <Column lg={showFilter ? 6 : 8} md={showFilter ? 6 : 8} className="sfg--datatable-treeview--section">
                  {selectedTreeData.length === 1 ? (
                    <div className="sfg--business-unit-detail-container sfg--tree-view-border">
                      <detailView key={selectedTreeData[0]}></detailView>
                    </div>
                  ) : (
                    <>
                      <EmptyState className="sfg-tree-view-emptystate" {...config.emptyStates[emptyState]}></EmptyState>
                    </>
                  )}
                </Column>
                </Grid>*/}
            </div>
          </Column>
        </Grid>
      </TableContainer>
    </>
  );
};

export { DataTableTreeView as default, DataTableTreeView };
