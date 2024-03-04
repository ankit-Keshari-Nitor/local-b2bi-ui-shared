import { cleanup, fireEvent, render, find, screen } from '@testing-library/react';

import { Breadcrumb } from './Breadcrumb';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

jest.mock('../../core/providers/RouterProvider', () => ({
  useRouter: () => {
    return [
      {
        path: '/',
        component: () => <div>Home</div>
      },
      {
        path: '/about',
        component: () => <div>about</div>
      },
      {
        path: '/contact',
        component: () => <div>Contact</div>
      }
    ];
  }
}));

const RouteNavigation = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/contact');
  };

  return (
    <button type="button" onClick={handleClick}>
      home
    </button>
  );
};

it('renders correct breadcrumbs', function () {
  render(
    <MemoryRouter>
      <RouteNavigation />
      <Breadcrumb></Breadcrumb>
    </MemoryRouter>
  );
  //  expect(screen.getByTestId("breadcrumb")).toBeInTheDocument()
  //  expect(screen.queryByText("Home")).not.toBeInTheDocument()
  //  fireEvent.click(screen.getByRole('button', {name:/home/i}));
  //  expect(screen.queryByText("Contact")).toBeInTheDocument();
});
