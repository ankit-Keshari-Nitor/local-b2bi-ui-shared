import { PageProvider, usePage } from './PageProvider';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from '@carbon/react';
const TestingComponent = () => {
  const { loadingState, setLoadingState } = usePage();

  const onAction = () => {
    setLoadingState('init');
  };
  return (
    <>
      <Button data-testid="login" onClick={() => onAction()}>
        login{' '}
      </Button>
      <div data-testid="loadstate">{loadingState}</div>
    </>
  );
};

it('get application enviorment ', () => {
  render(
    <PageProvider>
      <TestingComponent></TestingComponent>
    </PageProvider>
  );
  const btn = screen.getByRole('button', {
    name: /login/i
  });
  fireEvent.click(btn);
  const add = screen.getByTestId('loadstate');
  expect(add.textContent).toEqual('init');
});
