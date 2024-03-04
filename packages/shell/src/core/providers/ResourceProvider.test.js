import { ResourceContext, ResourceProvider, useResource } from './ResourceProvider';
import { cleanup, fireEvent, render, find, screen } from '@testing-library/react';

const AppRoles = {
  ADMIN: 'Admin',
  USER: 'User'
};

const AppResourceMapping = {
  LOGIN: {
    FORGOT_ID: {
      enabled: true
    },
    FORGOT_PASSWORD: {
      enabled: false
    }
  },
  APPLICATION: {
    LIST: {
      roles: [AppRoles.ADMIN, AppRoles.USER],
      enabled: true
    },
    ADD: {
      roles: [AppRoles.ADMIN, AppRoles.USER],
      enabled: true
    },
    DELETE: {
      roles: [AppRoles.ADMIN, AppRoles.USER],
      enabled: true
    },
    EDIT: {
      roles: [AppRoles.ADMIN, AppRoles.USER],
      enabled: true
    },
    VIEW: {
      roles: [AppRoles.ADMIN, AppRoles.USER],
      enabled: true
    },
    ACTIVATE: {
      roles: [AppRoles.ADMIN, AppRoles.USER],
      enabled: true
    },
    DEACTIVATE: {
      roles: [AppRoles.ADMIN, AppRoles.USER],
      enabled: true
    }
  },
}

const TestingComponent = () => {
  const { hasAccess } = useResource();
  const { isEnabled } = useResource();
  return (
    <>
      <div data-testid="delete">{hasAccess('APPLICATION.DELETE') ? 'true' : 'false'}</div>
      <div data-testid="add">{hasAccess('APPLICATION.ADD') ? 'true' : 'false'}</div>
      <div data-testid="add-enable">{isEnabled('APPLICATION.ADD') ? 'true' : 'false'}</div>
      <div data-testid="delete-enable">{isEnabled('APPLICATION.DELETE') ? 'true' : 'false'}</div>
    </>
  );
};

it(' Verify has permission value', () => {
  render(
    <ResourceProvider resourceMappings={AppResourceMapping} roles={['Admin']}>
      <TestingComponent></TestingComponent>
    </ResourceProvider>
  );
  const add = screen.getByTestId('add');
  expect(add.textContent).toEqual('true');

  expect(screen.getByTestId('delete')).toHaveTextContent('true');
  expect(screen.getByTestId('delete-enable')).toHaveTextContent('true');
  expect(screen.getByTestId('add-enable')).toHaveTextContent('true');
});

it(' Verify user has permission value', () => {
  render(
    <ResourceProvider resourceMappings={AppResourceMapping} roles={['User']}>
      <TestingComponent></TestingComponent>
    </ResourceProvider>
  );
  const add = screen.getByTestId('add');
  //  expect(add.textContent).toEqual("true");
  //  expect(screen.getByTestId('add-enable')).toHaveTextContent("true")
});
