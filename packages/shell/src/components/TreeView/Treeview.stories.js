/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import { Document, Folder, Enterprise, Application, ContainerServices } from '@carbon/icons-react';
import { default as TreeView, TreeNode } from './';
import { Tag, Search, Layer, Grid, Column } from '@carbon/react';
import './story.scss';

const nodes = [
  {
    id: '1',
    value: 'Level 1 (leaf)',
    label: <span>Level 1 (leaf)</span>,
    renderIcon: Document
  },
  {
    id: '2',
    value: 'Level 1 (leaf)',
    label: 'Level 1 (leaf)',
    renderIcon: Document
  },
  {
    id: '3',
    value: 'Level 1 (branch)',
    label: 'Level 1 (branch)',
    renderIcon: Folder,
    children: [
      {
        id: '3-1',
        value: 'Level 2 (leaf)',
        label: 'Level 2 (leaf)',
        renderIcon: Document
      },
      {
        id: '3-2',
        value: 'Level 2 (leaf)',
        label: 'Level 2 (leaf)',
        renderIcon: Document
      }
    ]
  },
  {
    id: '4',
    value: 'Level 1 (leaf)',
    label: 'Level 1 (leaf)',
    renderIcon: Document
  },
  {
    id: '5',
    value: 'Level 1 (branch)',
    label: 'Level 1 (branch)',
    isExpanded: true,
    renderIcon: Folder,
    children: [
      {
        id: '5-1',
        value: 'Level 2 (leaf)',
        label: 'Level 2 (leaf)',
        renderIcon: Document
      },
      {
        id: '5-2',
        value: 'Level 2 (leaf)',
        label: 'Level 2 (leaf)',
        renderIcon: Document
      },
      {
        id: '5-3',
        value: 'Level 2 (branch)',
        label: 'Level 2 (branch)',
        isExpanded: true,
        renderIcon: Folder,
        children: [
          {
            id: '5-4',
            value: 'Level 3 (leaf)',
            label: 'Level 3 (leaf)',
            renderIcon: Document
          },
          {
            id: '5-5',
            value: 'Level 3 (branch)',
            label: 'Level 3 (branch)',
            isExpanded: true,
            renderIcon: Folder,
            children: [
              {
                id: '5-6',
                value: 'Level 4 (leaf)',
                label: 'Level 4 (leaf)',
                renderIcon: Document
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '6',
    value: 'Level 1 (branch)',
    label: 'Level 1 (branch)',
    renderIcon: Folder,
    children: [
      {
        id: '6-1',
        value: 'Level 2 (leaf)',
        label: 'Level 2 (leaf)',
        renderIcon: Document
      },
      {
        id: '6-2',
        value: 'Level 2 (leaf)',
        label: 'Level 2 (leaf)',
        renderIcon: Document
      }
    ]
  },
  {
    id: '7',
    value: 'Level 1 (branch)',
    label: 'Level 1 (branch)',
    isExpanded: true,
    disabled: true,
    renderIcon: Folder,
    children: [
      {
        id: '7-1',
        value: 'Level 2 (leaf)',
        label: 'Level 2 (leaf)',
        renderIcon: Document
      },
      {
        id: '7-2',
        value: 'Level 2 (leaf)',
        label: 'Level 2 (leaf)',
        renderIcon: Document
      },
      {
        id: '8',
        value: 'Level 2 (branch)',
        label: 'Level 2 (branch)',
        isExpanded: true,
        renderIcon: Folder,
        children: [
          {
            id: '8-1',
            value: 'Level 3 (leaf)',
            label: 'Level 3 (leaf)',
            renderIcon: Document
          },
          {
            id: '8-2',
            value: 'Level 3 (leaf)',
            label: 'Level 3 (leaf)',
            renderIcon: Document
          }
        ]
      }
    ]
  }
];

const businessUnits = [
  {
    id: 'Boxmart',
    value: 'Boxmart',
    label: 'Boxmart',
    renderIcon: Enterprise,
    children: [
      {
        id: 'Procurement',
        value: 'Procurement',
        label: 'Procurement',
        renderIcon: ContainerServices,
        disabled: true,
        showCheckbox: false,
        children: [
          {
            id: 'ProcurementCompanyApplication',
            value: 'ProcurementCompanyApplication',
            label: 'Procurement Company Application',
            renderIcon: Application
          }
        ]
      },
      {
        id: 'RiskManagement',
        value: 'RiskManagement',
        label: 'Risk Management',
        renderIcon: ContainerServices,
        children: [
          {
            id: 'RMCompanyApplication',
            value: 'RMCompanyApplication',
            label: 'RM Company Application',
            renderIcon: Application
          }
        ]
      },
      {
        id: 'Legal',
        value: 'Legal',
        label: 'Legal',
        renderIcon: ContainerServices,
        children: [
          {
            id: 'LegalCompanyApplication1',
            value: 'LegalCompanyApplication1',
            label: 'LegalCompany Application 1',
            renderIcon: Application
          },
          {
            id: 'LegalCompanyApplication2',
            value: 'LegalCompanyApplication2',
            label: 'LegalCompany Application 2',
            renderIcon: Application
          },
          {
            id: 'LegalCompanyApplication3',
            value: 'LegalCompanyApplication3',
            label: 'LegalCompany Application 3',
            renderIcon: Application
          }
        ]
      },
      {
        id: 'Finance',
        value: 'Finance',
        label: 'Finance',
        renderIcon: ContainerServices,
        children: [
          {
            id: 'FinCompanyApplication1',
            value: 'FinCompanyApplication1',
            label: 'FinCompany Application 1',
            renderIcon: Application
          },
          {
            id: 'FinCompanyApplication2',
            value: 'FinCompanyApplication2',
            label: 'FinCompany Application 2',
            renderIcon: Application
          },
          {
            id: 'FinCompanyApplication3',
            value: 'FinCompanyApplication3',
            label: 'FinCompany Application 3',
            renderIcon: Application
          },
          {
            id: 'FinCompanyApplication4',
            value: 'FinCompanyApplication4',
            label: 'FinCompany Application 4',
            renderIcon: Application
          }
        ]
      }
    ]
  }
];

const roles = [
  {
    id: 'SFG_Roles',
    value: 'SFG Roles',
    label: 'SFG Roles',
    children: [
      {
        id: 'Company Administrator',
        value: 'Company Administrator',
        label: 'Company Administrator'
      },
      {
        id: 'Integration Architect',
        value: 'Integration Architect',
        label: 'Integration Architect'
      },
      {
        id: 'Operator',
        value: 'Operator',
        label: 'Operator'
      },
      {
        id: 'Route Provisioner',
        value: 'Route Provisioner',
        label: 'Route Provisioner'
      },
      {
        id: 'Business Unit Auditor',
        value: 'Business Unit Auditor',
        label: 'Business Unit Auditor'
      },
      {
        id: 'Application User',
        value: 'Application User',
        label: 'Application User'
      }
    ]
  },
  {
    id: 'SFG_Roles',
    value: 'SFG Roles',
    label: 'SFG Roles',
    children: []
  }
];

function renderTree({ nodes, expanded, withIcons = false, withAdditionalInfo = false, selected=[] }) {
  if (!nodes) {
    return;
  }
  return nodes.map(({ children, renderIcon, isExpanded, ...nodeProps }) => (
    <TreeNode
      key={nodeProps.id}
      renderIcon={withIcons ? renderIcon : null}
      additionalInfo={
        withAdditionalInfo ? (
          <>
            <Tag type="high-contrast" size="sm">
              {'2'}
            </Tag>
          </>
        ) : null
      }
      isExpanded={expanded ?? isExpanded}
      {...nodeProps}
    >
      {renderTree({ nodes: children, expanded, withIcons, withAdditionalInfo })}
    </TreeNode>
  ));
}

export default {
  title: 'components/TreeView',
  component: TreeView,
  subcomponents: {
    TreeNode
  },
  args: {},
  argTypes: {
    children: {
      table: {
        disable: true
      }
    },

    className: {
      table: {
        disable: true
      }
    },

    label: {
      table: {
        disable: true
      }
    },

    onSelect: {
      table: {
        disable: true
      }
    }
  }
};

export const Default = () => <TreeView label="Tree View">{renderTree({ nodes })}</TreeView>;

export const WithIcons = () => <TreeView label="Tree View">{renderTree({ nodes, withIcons: true })}</TreeView>;

export const WithControlledExpansion = () => {
  const [expanded, setExpanded] = useState(undefined);
  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <button type="button" onClick={() => setExpanded(true)}>
          expand all
        </button>
        <button type="button" onClick={() => setExpanded(false)}>
          collapse all
        </button>
      </div>
      <TreeView label="Tree View">{renderTree({ nodes, expanded })}</TreeView>
    </>
  );
};

export const WithMultiselect = () => (
  <TreeView label="Tree View" multiselect={true}>
    {renderTree({ nodes, withIcons: true })}
  </TreeView>
);

export const WithMultiselectCheckbox = () => (
  <TreeView label="Tree View" multiselect={true} showCheckbox={true}>
    {renderTree({ nodes, withIcons: true })}
  </TreeView>
);

export const ParentNotSelectable = () => (
  <TreeView label="Tree View" multiselect={true} showCheckbox={true} isParentSelectable={false}>
    {renderTree({ nodes, withIcons: true })}
  </TreeView>
);

export const WithAdditionalInfo = () => (
  <TreeView label="Tree View" multiselect={true} showCheckbox={true} isParentSelectable={false}>
    {renderTree({ nodes, withIcons: true, withAdditionalInfo: true })}
  </TreeView>
);

export const WithSearch = () => (
  <div style={{ padding: '1rem' }}>
    <Layer level={2}>
      <Grid>
        <Column lg={8} md={7}>
          <div className="sfg--tree-view">
            <Search
              closeButtonLabelText="Clear search input"
              defaultValue=""
              id="search-playground-1"
              labelText="asdfasfdsaf"
              placeholder="Search for Company, Organization Unit, Application"
              role="searchbox"
              size="md"
              type="text"
            />
            <TreeView label="Resources" multiselect={true} showCheckbox={true}>
              {renderTree({ nodes: businessUnits, expanded: true, withIcons: true, withAdditionalInfo: true })}
            </TreeView>
          </div>
        </Column>
        <Column lg={8} md={7}>
          <div className="sfg--tree-view roles">
            <Search
              closeButtonLabelText="Clear search input"
              defaultValue=""
              id="search-playground-1"
              labelText="asdfasfdsaf"
              placeholder="Search for Roles"
              role="searchbox"
              size="md"
              type="text"
            />
            <TreeView label="Roles" multiselect={true} showCheckbox={true} flat={false} isParentSelectable={false}>
              {renderTree({ nodes: roles, expanded: true })}
            </TreeView>
          </div>
        </Column>
      </Grid>
    </Layer>
  </div>
);

export const WithActions = () => (
  <div style={{ padding: '1rem' }}>
    <Layer level={2}>
      <Grid>
        <Column lg={10} md={9}>
          <div className="sfg--tree-view">
            <TreeView label="Resources" multiselect={true} showCheckbox={true}>
              {renderTree({ nodes: businessUnits, withIcons: true, withAdditionalInfo: true })}
            </TreeView>
          </div>
        </Column>
      </Grid>
    </Layer>
  </div>
);

export const WithSelections = () => {
  const [selected, setSelected] = useState(["1"]);
  const selectedItems = ["1"];
  const onSelect = function (event, item) {
    
    const index = selected.indexOf(item.id);
    if(index > -1){
      setSelected(selected.filter( value => value !== item.id));
    } else {
      selected.push(item.id)
      setSelected(selected);
    }
    console.log(selected);
  }
  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <button type="button" onClick={() => setSelected(selectedItems)}>
          Select Items
        </button>
        <button type="button" onClick={() => setSelected([])}>
          Unselect Items
        </button>
      </div>
      <TreeView label="Tree View" multiselect={true} showCheckbox={true} onSelect={onSelect} selected={selected}>{renderTree({ nodes })}</TreeView>
    </>
  );
};
export const Playground = (args) => (
  <TreeView label="Tree View" {...args}>
    {renderTree({ nodes })}
  </TreeView>
);

Playground.argTypes = {
  active: { control: { type: 'text' } },
  hideLabel: { defaultValue: false },
  multiselect: { defaultValue: false },
  showCheckbox: { defaultValue: false, control: { type: 'boolean' } },
  isParentSelectable: { defaultValue: true },
  size: {
    options: ['xs', 'sm'],
    control: { type: 'select' }
  }
};
