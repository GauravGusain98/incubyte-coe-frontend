import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TasksList from '../TasksList';
import { vi } from 'vitest';
import axiosInstance from '../../../services/axiosInstance';

vi.mock('../../../services/axiosInstance');

const mockTasks = [
  { id: 1, name: 'Task A', priority: 'High', dueDate: '2025-05-29' },
  { id: 2, name: 'Task B', priority: 'Low', dueDate: '2025-06-01' }
];

const mockPagination = { totalPages: 3 };

describe('TasksList', () => {
  beforeEach(() => {
    axiosInstance.get.mockResolvedValue({ data: { tasks: mockTasks, pagination: mockPagination } });
    axiosInstance.delete.mockResolvedValue({});
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders task list and interacts with filters', async () => {
    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Task A')).toBeInTheDocument();
      expect(screen.getByText('Task B')).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId('searchInput');
    await userEvent.type(searchInput, 'Test');
    expect(searchInput.value).toBe('Test');

    const sortBySelect = screen.getByTestId('sortBySelect');
    await userEvent.selectOptions(sortBySelect, 'priority');
    expect(sortBySelect.value).toBe('priority');

    const sortOrderSelect = screen.getByTestId('sortOrderSelect');
    await userEvent.selectOptions(sortOrderSelect, 'asc');
    expect(sortOrderSelect.value).toBe('asc');
  });

  test('handles delete task', async () => {
    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Task A'));
    const deleteButton = screen.getAllByTestId(/deleteButton-/i)[0];
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(axiosInstance.delete).toHaveBeenCalledWith('/task/1');
    });
  });

  test('disables pagination buttons appropriately', async () => {
    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Task A'));

    expect(screen.getByTestId('prevPageButton')).toBeDisabled();
    expect(screen.getByTestId('nextPageButton')).not.toBeDisabled();
  });

  test('handles no tasks state', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: { tasks: [], pagination: { totalPages: 1 } } });

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No tasks found.')).toBeInTheDocument();
    });
  });

  test('cancels deletion on confirm reject', async () => {
    vi.spyOn(window, 'confirm').mockReturnValueOnce(false);

    render(
      <MemoryRouter>
        <TasksList />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('Task A'));
    const deleteButton = screen.getAllByTestId(/deleteButton-/i)[0];
    await userEvent.click(deleteButton);

    expect(axiosInstance.delete).not.toHaveBeenCalled();
  });
});
