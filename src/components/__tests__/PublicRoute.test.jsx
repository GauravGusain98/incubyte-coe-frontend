import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import PublicRoute from '../PublicRoute';
import axiosInstance from '../../services/axiosInstance';

vi.mock('../../services/axiosInstance');

const PublicComponent = () => <div data-testid="public-content">Public Content</div>;
const HomePage = () => <div data-testid="home-page">Home Page</div>;

const renderWithRouter = (initialEntries = ['/login']) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<PublicRoute><PublicComponent /></PublicRoute>} />
        <Route path="/" element={<HomePage />} />
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

describe('PublicRoute', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockAuth('loading');
    renderWithRouter();

    expect(screen.getByText("Checking authentication...")).toBeInTheDocument();
  });

  it('renders public content when not authenticated', async () => {
    mockAuth('fail');
    renderWithRouter();

    const content = await screen.findByTestId('public-content');
    expect(content).toBeInTheDocument();
    expect(axiosInstance.get).toHaveBeenCalledWith('/user/me');
  });

  it('redirects to home if authenticated', async () => {
    mockAuth('success');
    renderWithRouter();

    const home = await screen.findByTestId('home-page');
    expect(home).toBeInTheDocument();
    expect(axiosInstance.get).toHaveBeenCalledWith('/user/me');
  });
});
