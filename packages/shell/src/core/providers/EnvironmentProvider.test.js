import { EnvironmentProvider } from './EnvironmentProvider';
import { fireEvent, render, screen } from '@testing-library/react';
import { useEnvironment } from './EnvironmentProvider';
import { React, useState } from 'react';
import { Button } from '@carbon/react';

const AppEnv = {
  LOGIN_URL : "/identity/userauth/v1/authenticate"
}

const TestingComponent = () => {
  const { getEnvironmentValue } = useEnvironment();
  const [envalue, setEnvalue] = useState('');
  const onAction = () => {
    const value = getEnvironmentValue('LOGIN_URL');
    setEnvalue(value);
  };
  return (
    <>
      <Button data-testid="login" onClick={() => onAction()}>
        login{' '}
      </Button>
      <div data-testid="env">{envalue}</div>
    </>
  );
};

it('get application enviorment ', () => {
  render(
    <EnvironmentProvider config={AppEnv}>
      <TestingComponent></TestingComponent>
    </EnvironmentProvider>
  );
  const btn = screen.getByRole('button', {
    name: /login/i
  });
  fireEvent.click(btn);
  const add = screen.getByTestId('env');
  expect(add.textContent).toEqual('/identity/userauth/v1/authenticate');
});
