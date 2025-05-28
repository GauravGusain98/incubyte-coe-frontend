import { render, screen } from '@testing-library/react';
import HomePage from '../HomePage';
import { describe, it, expect, beforeEach } from 'vitest';

describe('HomePage Component', () => {
  let container;

  beforeEach(() => {
    const renderResult = render(<HomePage />);
    container = renderResult.container;
  });

  it('should render without crashing', () => {
    const heading = screen.getByTestId('welcomeMessage');
    expect(heading).toBeInTheDocument();
  });

  it('should display the correct welcome message', () => {
    const heading = screen.getByTestId('welcomeMessage');
    expect(heading).toHaveTextContent("Welcome to the Home Page");
  });

  it('should display the correct success message', () => {
    const message = screen.getByTestId('successMessage');
    expect(message).toHaveTextContent("You're successfully logged in.");
  });

  it('should apply Tailwind CSS utility classes correctly', () => {
    const wrapperDiv = container.querySelector('div');
    expect(wrapperDiv.className).toMatch("bg-white");
    expect(wrapperDiv.className).toMatch("shadow-lg");
    expect(wrapperDiv.className).toMatch("rounded-2xl");
  });
});
