import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import PrivateRoute from '../PrivateRoute';
import axiosInstance from '../../services/axiosInstance';

// Mock axiosInstance
vi.mock('../../services/axiosInstance');

const ProtectedComponent = () => <div data-testid="protected-content">Protected Content</div>;
const LoginPage = () => <div data-testid="login-page">Login Page</div>;

const renderWithRouter = (initialEntries = ['/private']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/private" element={<PrivateRoute><ProtectedComponent /></PrivateRoute>} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </MemoryRouter>
  );

const mockAuth = (responseType = 'success') => {
  if (responseType === 'success') {
    axiosInstance.get.mockResolvedValueOnce({ data: { id: 1, name: 'User' } });
  } else if (responseType === 'fail') {
    axiosInstance.get.mockRejectedValueOnce(new Error('Unauthorized'));
  } else if (responseType === 'loading') {
    axiosInstance.get.mockReturnValue(new Promise(() => {})); // never resolves
  }
};

describe('PrivateRoute', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockAuth('loading');
    renderWithRouter();

    expect(screen.getByText("Checking authentication...")).toBeInTheDocument();
  });

  it('renders protected content when authenticated', async () => {
    mockAuth('success');
    renderWithRouter();

    const content = await screen.findByTestId('protected-content');
    expect(content).toBeInTheDocument();
    expect(axiosInstance.get).toHaveBeenCalledWith('/user/me');
  });

  it('redirects to login if not authenticated', async () => {
    mockAuth('fail');
    renderWithRouter();

    const loginPage = await screen.findByTestId('login-page');
    expect(loginPage).toBeInTheDocument();
    expect(axiosInstance.get).toHaveBeenCalledWith('/user/me');
  });
});
