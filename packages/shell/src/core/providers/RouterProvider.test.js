import { EnvironmentContext, RouterProvider } from './RouterProvider';
import { cleanup, fireEvent, render, find, screen } from '@testing-library/react';
import { React, useState, useEffect } from 'react';
import { Button } from '@carbon/react';
import { ResourceContext } from './ResourceProvider';
import { useResource } from './ResourceProvider';

jest.mock('./ResourceProvider', () => ({
  useResource: jest.fn()
}));

const routes = [
  {
    path: '/',
    component: () => <div>Home</div>
  },
  {
    path: '/about',
    component: () => <div>About</div>,
    resourceKey: 'about-page'
  },
  {
    path: '/contact',
    component: () => <div>Contact</div>,
    resourceKey: 'contact-page'
  }
];

const TestingComponent = () => {
  const onAction = () => {};
  return (
    <>
      <Button data-testid="login" onClick={() => onAction()}>
        login{' '}
      </Button>
    </>
  );
};

it('get application enviorment ', () => {
  //useResource.mockReturnValueOnce({ hasAccess: jest.fn(() => true) });
  render(
    <RouterProvider routes={routes}>
      <TestingComponent></TestingComponent>
    </RouterProvider>
  );
  //expect(useResource).toHaveBeenCalledTimes(1);
  //expect(useResource).toHaveBeenCalledWith();
  // const btn=screen.getByRole('button', {
  //   name:/login/i
  // })
  // fireEvent.click(btn);
  // const add=screen.getByTestId('env');
  // expect(add.textContent).toEqual("/api/identity/userauth/v1/authenticate");
});
