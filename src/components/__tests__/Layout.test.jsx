import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from '../Layout'; // Adjust the path as necessary

vi.mock('../Navbar', () => ({
  default: () => <nav data-testid="mock-navbar">Mock Navbar</nav>
}));

const DummyComponent = () => <div data-testid="dummy-child">Nested Route Content</div>;

describe('Layout Component', () => {
  it('renders the Navbar and nested route content via Outlet', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DummyComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();

    expect(screen.getByTestId('dummy-child')).toBeInTheDocument();

    const mainElement = screen.getByRole('main', { hidden: true });
    expect(mainElement).toHaveClass('px-8');
  });
});
