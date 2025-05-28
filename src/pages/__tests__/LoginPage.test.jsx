import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Login from '../LoginPage';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const mockLogin = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

const renderComponent = () =>
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );


describe('Login Page', () => {
  let emailInput;
  let passwordInput;
  let submitButton
  
  beforeEach(() => {
    vi.clearAllMocks();
    renderComponent();
    emailInput = screen.getByTestId('email');
    passwordInput = screen.getByTestId('password');
    submitButton = screen.getByTestId('submit')
  });

  it('renders login form correctly', () => {
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('shows validation errors if fields are empty', async () => {
    await userEvent.click(submitButton);

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });

  it('email and password fields accept input', async () => {
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('shows error on invalid email format', async () => {
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);
    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
  });

  it('calls login function on valid form submit', async () => {
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('displays alert on login failure', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials. Please try again.'));

    window.alert = vi.fn();
    await userEvent.type(emailInput, 'wrong@example.com');
    await userEvent.type(passwordInput, 'wrongpass');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid credentials. Please try again.');
    });
  });

  it('register link is present and has correct href', () => {
    const registerLink = screen.getByTestId('registerLink');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});
