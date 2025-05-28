import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateTask from '../CreateTask'; // Adjust path
import { BrowserRouter } from 'react-router-dom';
import axiosInstance from '../../../services/axiosInstance';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', () => {
  const actual = require('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock('../../../services/axiosInstance');

const renderComponent = () =>
  render(
    <BrowserRouter>
      <CreateTask />
    </BrowserRouter>
  );

describe('CreateTask Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    renderComponent();
  });

  it('renders all form fields and the submit button', () => {
    expect(screen.getByTestId('heading')).toHaveTextContent('Create New Task');
    expect(screen.getByTestId('taskNameInput')).toBeInTheDocument();
    expect(screen.getByTestId('prioritySelect')).toBeInTheDocument();
    expect(screen.getByTestId('statusSelect')).toBeInTheDocument();
    expect(screen.getByTestId('startDateInput')).toBeInTheDocument();
    expect(screen.getByTestId('dueDateInput')).toBeInTheDocument();
    expect(screen.getByTestId('descriptionTextarea')).toBeInTheDocument();
    expect(screen.getByTestId('submitButton')).toBeInTheDocument();
  });

  it('validates required fields and shows errors', async () => {
    await userEvent.click(screen.getByTestId('submitButton'));

    await waitFor(() => {
      expect(screen.getByTestId('taskNameError')).toHaveTextContent('Task name is required');
      expect(screen.getByTestId('priorityError')).toHaveTextContent('Priority is required');
      expect(screen.getByTestId('statusError')).toHaveTextContent('Status is required');
      expect(screen.getByTestId('startDateError')).toHaveTextContent('Start date is required');
      expect(screen.getByTestId('dueDateError')).toHaveTextContent('Due date is required');
    });
  });

  it('submits form successfully and navigates to /tasks', async () => {
    axiosInstance.post.mockResolvedValueOnce({ data: {} });

    await userEvent.type(screen.getByTestId('taskNameInput'), 'Test Task');
    await userEvent.selectOptions(screen.getByTestId('prioritySelect'), 'medium');
    await userEvent.selectOptions(screen.getByTestId('statusSelect'), 'pending');
    await userEvent.type(screen.getByTestId('startDateInput'), '2023-01-01');
    await userEvent.type(screen.getByTestId('dueDateInput'), '2023-01-10');
    await userEvent.type(screen.getByTestId('descriptionTextarea'), 'This is a test description.');

    await userEvent.click(screen.getByTestId('submitButton'));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/task/add', {
        name: 'Test Task',
        priority: 'medium',
        status: 'pending',
        startDate: '2023-01-01',
        dueDate: '2023-01-10',
        description: 'This is a test description.',
      });
      expect(mockedNavigate).toHaveBeenCalledWith('/tasks');
      expect(screen.getByTestId('submitButton')).not.toBeDisabled();
    });
  });

  it('shows error message when submission fails', async () => {
    axiosInstance.post.mockRejectedValueOnce(new Error('Network error'));

    await userEvent.type(screen.getByTestId('taskNameInput'), 'Test Task');
    await userEvent.selectOptions(screen.getByTestId('prioritySelect'), 'medium');
    await userEvent.selectOptions(screen.getByTestId('statusSelect'), 'pending');
    await userEvent.type(screen.getByTestId('startDateInput'), '2023-01-01');
    await userEvent.type(screen.getByTestId('dueDateInput'), '2023-01-10');

    await userEvent.click(screen.getByTestId('submitButton'));

    await waitFor(() => {
      expect(screen.getByTestId('errorMessage')).toHaveTextContent('Failed to create task. Please try again.');
      expect(screen.getByTestId('submitButton')).not.toBeDisabled();
      expect(mockedNavigate).not.toHaveBeenCalled();
    });
  });

  it('disables submit button while loading', async () => {
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    axiosInstance.post.mockReturnValue(promise);

    await userEvent.type(screen.getByTestId('taskNameInput'), 'Test Task');
    await userEvent.selectOptions(screen.getByTestId('prioritySelect'), 'medium');
    await userEvent.selectOptions(screen.getByTestId('statusSelect'), 'pending');
    await userEvent.type(screen.getByTestId('startDateInput'), '2023-01-01');
    await userEvent.type(screen.getByTestId('dueDateInput'), '2023-01-10');

    await userEvent.click(screen.getByTestId('submitButton'));

    expect(screen.getByTestId('submitButton')).toBeDisabled();
    expect(screen.getByTestId('submitButton')).toHaveTextContent('Creating...');

    resolvePromise();

    await waitFor(() => {
      expect(screen.getByTestId('submitButton')).not.toBeDisabled();
      expect(screen.getByTestId('submitButton')).toHaveTextContent('Create Task');
    });
  });
});
