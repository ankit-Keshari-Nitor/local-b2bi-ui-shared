import { render, screen, fireEvent, act } from '@testing-library/react';
import { SFGTreeView } from './SFGTreeView';

const mockSearchFn = jest.fn();
const mockOnMenuItemClick = jest.fn();
const mockData = [
  {
    id: '1',
    value: 'Test',
    label: 'Test'
  },
  {
    id: '2',
    value: 'Tree',
    label: 'Tree',
    children: [
      {
        id: '2.1',
        value: 'Children',
        label: 'Children',
        menu: {
          options: [
            { id: 'test-menu-item-1', label: 'test-menu-item-1', onAction: mockOnMenuItemClick}
          ]
        }
      }
    ]
  }
];
const config = {
  search: {
    closeLabel: 'Close',
    label: 'Search',
    placeholder: 'Search for role'
  },
  treeview: {
    label: 'Role',
    multiSelect: true,
    showCheckbox: true,
    onSelect: (...args) => {
      return console.log(args);
    }
  },
  actions: [
    {
      type: 'Button',
      label: 'Add',
      name: 'Add',
      state: (...args) => {
        return console.log(args);
      },
      onAction: (...args) => {
        return console.log(args);
      }
    }
  ],
  emptyStates: {
    ResourceNotSelected: {
      image: <div data-testid="ResourceNotSelected-Image"></div>,
      description: 'mod-user:roles.noRoleSelectedDescription'
    }
  }
};

describe('SFG Tree View Component', () => {
  it('Verify the tree view is rendered', async () => {
    render(<SFGTreeView name="TestSFGTreeView" className="TestClass" data={mockData} selected={[]} config={config} loadingState={false} emptyState={undefined}></SFGTreeView>);
    expect(await screen.findByTestId('sfg--tree-view')).toBeInTheDocument();
  });

  it('Verify that search view is configurable', async () => {
    let configTest = {
      treeview: config.treeview
    };
    const { container } = render(
      <SFGTreeView name="TestSFGTreeView" className="TestClass" data={mockData} selected={[]} config={configTest} loadingState={false} emptyState={undefined}></SFGTreeView>
    );
    let search = container.getElementsByClassName('sfg-tree-search');
    expect(search.length).toBe(0);

    const configTest1 = {
      search: config.search,
      treeview: config.treeview
    };
    const { container: container1 } = render(
      <SFGTreeView name="TestSFGTreeView" className="TestClass" data={mockData} selected={[]} config={configTest1} loadingState={false} emptyState={undefined}></SFGTreeView>
    );
    search = container1.getElementsByClassName('sfg-tree-search');
    expect(search.length).toBe(1);
  });

  it('Verify that actions are configurable', async () => {
    let configTest = {
      treeview: config.treeview
    };
    const { container } = render(
      <SFGTreeView name="TestSFGTreeView" className="TestClass" data={mockData} selected={[]} config={configTest} loadingState={false} emptyState={undefined}></SFGTreeView>
    );
    let actions = container.getElementsByClassName('sfg--tree-view-actions');
    expect(actions.length).toBe(0);

    const configTest1 = {
      actions: config.actions,
      treeview: config.treeview
    };
    const { container: container1 } = render(
      <SFGTreeView name="TestSFGTreeView" className="TestClass" data={mockData} selected={[]} config={configTest1} loadingState={false} emptyState={undefined}></SFGTreeView>
    );
    actions = container1.getElementsByClassName('sfg--tree-view-actions');
    expect(actions.length).toBe(1);
  });

  it('Verify the empty state is rendered based on empty state', async () => {
    const { container } = render(
      <SFGTreeView name="TestSFGTreeView" className="TestClass" data={mockData} selected={[]} config={config} loadingState={false} emptyState={undefined}></SFGTreeView>
    );
    let emptyState = container.getElementsByClassName('sfg-tree-view-emptystate');
    expect(emptyState.length).toBe(0);

    const { container: container1 } = render(
      <SFGTreeView name="TestSFGTreeView" className="TestClass" data={mockData} selected={[]} config={config} loadingState={false} emptyState={'ResourceNotSelected'}></SFGTreeView>
    );
    let emptyState1 = container1.getElementsByClassName('sfg-tree-view-emptystate');
    expect(emptyState1.length).toBe(1);
  });

  it('Verify that tree view is not rendered when no data is passed', () => {
    const { container } = render(
      <SFGTreeView name="TestSFGTreeView" className="TestClass" data={undefined} selected={[]} config={config} loadingState={false} emptyState={undefined}></SFGTreeView>
    );
    let emptyState = container.getElementsByClassName('cds--tree-node');
    expect(emptyState.length).toBe(0);
  });

  it('Verify that clientside search is enabled when onSearch is not implemented', async () => {
    const { container } = render(
      <SFGTreeView name="TestSFGTreeView" className="TestClass" data={mockData} selected={[]} config={config} loadingState={false} emptyState={undefined}></SFGTreeView>
    );
    let searchInput = await screen.findByTestId('TestSFGTreeView-search');
    expect(searchInput).toBeInTheDocument();
    let filteredNodes = container.getElementsByClassName('cds--tree-node');
    expect(filteredNodes.length).toBe(3);
    act(() => {
      fireEvent.change(searchInput, { target: { value: 'Tr' } });
    });
    filteredNodes = container.getElementsByClassName('cds--tree-node');
    expect(filteredNodes.length).toBe(2);
    act(() => {
      fireEvent.change(searchInput, { target: { value: 'Trr' } });
    });
    filteredNodes = container.getElementsByClassName('cds--tree-node');
    expect(filteredNodes.length).toBe(0);
    act(() => {
      fireEvent.click(container.getElementsByClassName('cds--search-close')[0]);
    });
    filteredNodes = container.getElementsByClassName('cds--tree-node');
    expect(filteredNodes.length).toBe(3);
  });

  it('Verify that serverside search is enabled when onSearch is implemented', async () => {
    const { container } = render(
      <SFGTreeView
        name="TestSFGTreeView"
        className="TestClass"
        data={mockData}
        selected={[]}
        config={{ ...config, search: { ...config.search, onSearch: mockSearchFn } }}
        loadingState={false}
        emptyState={undefined}
      ></SFGTreeView>
    );
    let searchInput = await screen.findByTestId('TestSFGTreeView-search');
    expect(searchInput).toBeInTheDocument();
    let filteredNodes = container.getElementsByClassName('cds--tree-node');
    expect(filteredNodes.length).toBe(3);
    act(() => {
      fireEvent.change(searchInput, { target: { value: 'Tr' } });
    });
    act(() => {
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });
    });
    expect(mockSearchFn).toHaveBeenCalled();
  });

  it('Verify that menu is displayed when menu is passed', async () => {
    const { container } = render(
      <SFGTreeView
        name="TestSFGTreeView"
        className="TestClass"
        data={mockData}
        selected={[]}
        config={{ ...config, search: { ...config.search, onSearch: mockSearchFn } }}
        loadingState={false}
        emptyState={undefined}
      ></SFGTreeView>
    );
    let overflowMenu = await screen.findByTestId('overflow-menu-2.1');
    expect(overflowMenu).toBeInTheDocument();
    act(() => {
      fireEvent.click(overflowMenu);
    });
    let overflowMenuItem = await screen.findByTestId('test-menu-item-1');
    expect(overflowMenuItem).toBeInTheDocument();
    act(() => {
      fireEvent.click(overflowMenuItem);
    });
    expect(mockOnMenuItemClick).toHaveBeenCalled();
  });

});
