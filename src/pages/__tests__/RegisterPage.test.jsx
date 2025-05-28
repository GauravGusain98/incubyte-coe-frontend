import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../RegisterPage';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('../../services/authService', () => {
  return {
    register: vi.fn(),
  };
});

import { register as mockRegisterAPI } from '../../services/authService';

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );
};

describe('Register Page', () => {
  let firstNameInput;
  let lastNameInput;
  let emailInput;
  let passwordInput;
  let confirmPasswordInput;
  let submitButton;

  beforeEach(() => {
    vi.clearAllMocks();
    renderComponent();

    firstNameInput = screen.getByTestId('firstName');
    lastNameInput = screen.getByTestId('lastName');
    emailInput = screen.getByTestId('email');
    passwordInput = screen.getByTestId('password');
    confirmPasswordInput = screen.getByTestId('confirmPassword');
    submitButton = screen.getByTestId('submit');
  });

  it('renders the form inputs and submit button', () => {
    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('shows validation messages on empty form submit', async () => {
    await userEvent.click(submitButton);

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(await screen.findByText('Please confirm your password')).toBeInTheDocument();
  });

  it('shows password mismatch error', async () => {
    await userEvent.type(firstNameInput, 'Test');
    await userEvent.type(lastNameInput, 'User');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'mismatch');
    await userEvent.click(submitButton);

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('calls register API on valid input', async () => {
    mockRegisterAPI.mockResolvedValueOnce({});

    window.alert = vi.fn();
    await userEvent.type(firstNameInput, 'Test');
    await userEvent.type(lastNameInput, 'User');
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegisterAPI).toHaveBeenCalledWith({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(window.alert).toHaveBeenCalledWith('Registration successful! Please login.');
    });
  });

  it('shows alert on registration failure', async () => {
    mockRegisterAPI.mockRejectedValueOnce(new Error('Failed'));

    window.alert = vi.fn();
     await userEvent.type(firstNameInput, 'Test');
    await userEvent.type(lastNameInput, 'User');
    await userEvent.type(emailInput, 'fail@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Registration failed!');
    });
  });
});
