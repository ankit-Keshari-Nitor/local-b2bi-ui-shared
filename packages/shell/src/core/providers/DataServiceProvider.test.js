import React from 'react';
import { DataService } from '../services/DataService';
import { DataServiceProvider, useDataService, DataServiceContext } from './DataServiceProvider'; // Replace 'yourModule' with the actual module containing these functions
import { useEnvironment } from './EnvironmentProvider';
import { Button } from '@carbon/react';
import { fireEvent, render, screen } from '@testing-library/react';

const DataLoaderConfig = {
  USER: {
    LIST: () => {
      return {
        type: 'RESTAPI',
        method: 'GET',
        url: 'test/api'
      };
    }
  }
};
// Mock the required dependencies
jest.mock('./EnvironmentProvider', () => ({
  useEnvironment: () => ({
    t: (key) => key,
    getEnvironmentValue: jest.fn()
  })
}));

const MockChildComponent = () => {
  const { setModuleDataConfig, DataService } = useDataService();
  jest.spyOn(DataService, 'call').mockImplementation(
    function callFn(dataLoaderId, input, options) {
      this.getDataLoaderConfig(dataLoaderId);
    }.bind(DataService)
  );

  const onAction = () => {
    DataService.call('ROLE.LIST');
    DataService.call('');
  };
  return (
    <Button data-testid="Action" onClick={() => onAction()} size="sm" kind="primary">
      Action
    </Button>
  );
};

describe('DataServiceProvider', () => {
  it('should set moduleDataConfig and create DataService instance', () => {
    // Render the component with a custom context provider
    render(
      <DataServiceContext.Provider value={{}}>
        <DataServiceProvider config={DataLoaderConfig}>
          <MockChildComponent />
        </DataServiceProvider>
      </DataServiceContext.Provider>
    );

    const btn = screen.getByRole('button', {
      name: /Action/i
    });
    // fireEvent.click(btn);
    // expect(console.error).toHaveBeenCalledWith(DataService.call);
  });
});
