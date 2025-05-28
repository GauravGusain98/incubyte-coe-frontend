import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

const logoutMock = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    logout: logoutMock,
  }),
}));

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    logoutMock.mockClear();
    renderNavbar();
  });

  it('renders the navbar and its elements', () => {
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('logo-link')).toBeInTheDocument();
    expect(screen.getByTestId('task-link')).toBeInTheDocument();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
  });

  it('contains correct navigation links', () => {
    expect(screen.getByTestId('logo-link')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('task-link')).toHaveAttribute('href', '/tasks');
  });

  it('calls logout when the logout button is clicked', async () => {
    await userEvent.click(screen.getByTestId('logout-button'));
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
