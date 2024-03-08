import { ResourceProvider, useResource } from './ResourceProvider';
import { render, screen } from '@testing-library/react';
import * as AuthP from './AuthProvider';

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
  }
};

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

describe('ResourceProvider:', () => {
  beforeEach(() => {
    jest.spyOn(AuthP, 'useAuth').mockImplementation(() => {
      return {
        user: {
          userName: 'admin',
          autthenticated: true,
          organizationKey: 'DEFAULT',
          roles: ['Administrator'],
          permissions: [
            'user:view',
            'user:create',
            'user:edit',
            'user:delete',
            'user:activate',
            'user:deactivate',
            'businessUnit:view',
            'businessUnit:create',
            'businessUnit:update',
            'businessUnit:delete'
          ]
        }
      };
    });
  });

  it(' Verify has permission value', () => {
    render(
      <ResourceProvider resourceMappings={AppResourceMapping}>
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
});
