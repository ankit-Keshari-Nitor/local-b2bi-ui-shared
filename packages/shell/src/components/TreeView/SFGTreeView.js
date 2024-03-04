import React from 'react';
import TreeView from './TreeView';
import TreeNode from './TreeNode';
import { Search, Button, Tag, Tooltip, OverflowMenu, OverflowMenuItem } from '@carbon/react';
import { Information } from '@carbon/icons-react';
import { useTranslation } from 'react-i18next';
import './SFGTreeView.scss';
import { SFGEmptyState } from '../EmptyState/EmptyState';
import { useEffect, useState } from 'react';

const SFGTreeView = ({ name, className, data, selected, config, loadingState, emptyState, ...rest }) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState();
  const [filteredTreeData, setFilteredTreeData] = useState([]);

  const renderTree = ({ nodes }) => {
    if (!nodes) {
      return;
    }

    const getAdditionalInfo = (nodeId, { tag, tooltip, menu }) => {
      if (tag) {
        return (
          <Tag type="high-contrast" size="sm">
            {tag}
          </Tag>
        );
      }
      if (tooltip) {
        return (
          <Tooltip label={tooltip} align="left">
            <button className="sfg--tooltip-trigger" type="button">
              <Information />
            </button>
          </Tooltip>
        );
      }
      if (menu) {
        return (
          <OverflowMenu data-testid={`overflow-menu-${nodeId}`} label={tooltip} align="left" size="sm">
            {menu.options.map((option) => {
              return (
                <OverflowMenuItem
                  key={option.id}
                  data-testid={option.id}
                  onClick={() => {
                    option.onAction({ id: nodeId });
                  }}
                  itemText={t(option.label)}
                ></OverflowMenuItem>
              );
            })}
          </OverflowMenu>
        );
      }
      return null;
    };

    return nodes.map(({ children, additionalInfo, tooltip, menu, ...nodeProps }) => (
      <TreeNode
        data-testid={nodeProps.id}
        key={nodeProps.id}
        isExpanded={true}
        renderIcon={nodeProps.icon ? nodeProps.icon : null}
        additionalInfo={getAdditionalInfo(nodeProps.id, { additionalInfo, tooltip, menu })}
        name={nodeProps.label}
        {...nodeProps}
      >
        {renderTree({ nodes: children })}
      </TreeNode>
    ));
  };

  const onSearch = (searchInput) => {
    setSearchText(searchInput);
  };

  const filterTreeData = (tree, searchText) => {
    let result = [];
    if (searchText === undefined || searchText === '') {
      result = tree;
    } else {
      for (const node of tree) {
        if (node.label.toLowerCase().includes(searchText.toLowerCase())) {
          result.push(node);
        } else if (node.children) {
          const subtree = filterTreeData(node.children, searchText);
          if (subtree.length) {
            result.push({
              id: node.id,
              value: node.value,
              label: node.label,
              children: subtree
            });
          }
        }
      }
    }
    return result;
  };

  useEffect(() => {
    setFilteredTreeData(filterTreeData(data, searchText));
  }, [searchText, data]);
  return (
    <>
      <div className="sfg--tree-view" data-testid="sfg--tree-view" name={name}>
        {config.search && (
          <Search
            closeButtonLabelText={t(config.search.closeLabel)}
            defaultValue=""
            id={name + '-search'}
            data-testid={name + '-search'}
            labelText={t(config.search.label)}
            placeholder={t(config.search.placeholder)}
            role="searchbox"
            size="md"
            type="text"
            className="sfg-tree-search"
            onKeyDown={(event) => {
              if (event.key === 'Enter' && config.search.onSearch) {
                config.search.onSearch(event.target.value);
              }
            }}
            onChange={(event) => {
              config.search.onSearch ? config.search.onSearch(event.target.value) : onSearch(event.target.value);
            }}
            onClear={() => {
              config.search.onSearch ? config.search.onSearch('') : onSearch('');
            }}
          />
        )}

        <TreeView
          hideLabel={config.treeview.hideLabel}
          label={t(config.treeview.label)}
          multiselect={config.treeview.multiSelect}
          showCheckbox={config.treeview.showCheckbox}
          selected={selected}
          onSelect={config.treeview.onSelect}
          size={config.treeview.size}
        >
          {emptyState === undefined || config.emptyStates === undefined ? (
            renderTree({ nodes: filteredTreeData })
          ) : (
            <>
              <SFGEmptyState className="sfg-tree-view-emptystate" {...config.emptyStates[emptyState]}></SFGEmptyState>
            </>
          )}
        </TreeView>
        {config.actions && (
          <div className="sfg--tree-view-actions">
            {config.actions.map((action) => (
              <Button key={action.name} id={action.id} name={action.name} kind="tertiary" size="sm" {...action.state()} className="full-width sfg--tree-view-action" onClick={action.onAction}>
                {t(action.label)}
              </Button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export { SFGTreeView };
