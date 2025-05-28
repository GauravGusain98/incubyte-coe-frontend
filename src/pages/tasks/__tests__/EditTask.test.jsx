import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditTask from '../EditTask';
import { BrowserRouter } from 'react-router-dom';
import axiosInstance from '../../../services/axiosInstance';

const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
    useParams: () => ({ id: '123' }),
  };
});

vi.mock('../../../services/axiosInstance');

const renderComponent = () =>
  render(
    <BrowserRouter>
      <EditTask />
    </BrowserRouter>
  );

describe('EditTask Component', () => {
  const taskData = {
    name: 'Test Task',
    description: 'Task description',
    startDate: '2023-01-01',
    dueDate: '2023-01-10',
    priority: 'medium',
    status: 'pending',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and populates form fields on mount', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: taskData });

    renderComponent();

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith('/task/123');
    });

    expect(screen.getByTestId('nameInput')).toHaveValue(taskData.name);
    expect(screen.getByTestId('descriptionTextarea')).toHaveValue(taskData.description);
    expect(screen.getByTestId('startDateInput')).toHaveValue(taskData.startDate);
    expect(screen.getByTestId('dueDateInput')).toHaveValue(taskData.dueDate);
    expect(screen.getByTestId('prioritySelect')).toHaveValue(taskData.priority);
    expect(screen.getByTestId('statusSelect')).toHaveValue(taskData.status);
  });

  it('shows error message if fetch fails', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('Fetch failed'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('errorMessage')).toHaveTextContent('Failed to fetch task data.');
    });
  });

  it('submits updated task and navigates to /tasks', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: taskData });
    axiosInstance.put.mockResolvedValueOnce({});

    renderComponent();

    await waitFor(() => expect(screen.getByTestId('nameInput')).toHaveValue(taskData.name));

    await userEvent.clear(screen.getByTestId('nameInput'));
    await userEvent.type(screen.getByTestId('nameInput'), 'Updated Task');
    await userEvent.clear(screen.getByTestId('descriptionTextarea'));
    await userEvent.type(screen.getByTestId('descriptionTextarea'), 'Updated description');
    await userEvent.selectOptions(screen.getByTestId('prioritySelect'), 'high');
    await userEvent.selectOptions(screen.getByTestId('statusSelect'), 'completed');
    await userEvent.clear(screen.getByTestId('startDateInput'));
    await userEvent.type(screen.getByTestId('startDateInput'), '2023-02-01');
    await userEvent.clear(screen.getByTestId('dueDateInput'));
    await userEvent.type(screen.getByTestId('dueDateInput'), '2023-02-10');

    await userEvent.click(screen.getByTestId('submitButton'));

    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith('/task/123', {
        name: 'Updated Task',
        description: 'Updated description',
        priority: 'high',
        status: 'completed',
        startDate: '2023-02-01',
        dueDate: '2023-02-10',
      });
      expect(mockedNavigate).toHaveBeenCalledWith('/tasks');
    });
  });

  it('shows error message if update fails', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: taskData });
    axiosInstance.put.mockRejectedValueOnce(new Error('Update failed'));

    renderComponent();

    await waitFor(() => expect(screen.getByTestId('nameInput')).toHaveValue(taskData.name));

    await userEvent.click(screen.getByTestId('submitButton'));

    await waitFor(() => {
      expect(screen.getByTestId('errorMessage')).toHaveTextContent('Failed to update task. Please try again.');
      expect(mockedNavigate).not.toHaveBeenCalled();
    });
  });

  it('allows empty optional fields', async () => {
    const minimalData = {
      name: '',
      description: '',
      startDate: '',
      dueDate: '',
      priority: 'low',
      status: 'pending',
    };

    axiosInstance.get.mockResolvedValueOnce({ data: minimalData });
    axiosInstance.put.mockResolvedValueOnce({});

    renderComponent();

    await waitFor(() => expect(screen.getByTestId('prioritySelect')).toHaveValue('low'));
    await userEvent.click(screen.getByTestId('submitButton'));

    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith('/task/123', minimalData);
      expect(mockedNavigate).toHaveBeenCalledWith('/tasks');
    });
  });

  it('renders all inputs and labels correctly', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: taskData });

    renderComponent();

    await waitFor(() => expect(screen.getByTestId('editTaskForm')).toBeInTheDocument());

    expect(screen.getByTestId('nameLabel')).toHaveTextContent('Name');
    expect(screen.getByTestId('nameInput')).toBeInTheDocument();

    expect(screen.getByTestId('descriptionLabel')).toHaveTextContent('Description');
    expect(screen.getByTestId('descriptionTextarea')).toBeInTheDocument();

    expect(screen.getByTestId('startDateLabel')).toHaveTextContent('Start Date');
    expect(screen.getByTestId('startDateInput')).toBeInTheDocument();

    expect(screen.getByTestId('dueDateLabel')).toHaveTextContent('Due Date');
    expect(screen.getByTestId('dueDateInput')).toBeInTheDocument();

    expect(screen.getByTestId('priorityLabel')).toHaveTextContent('Priority');
    expect(screen.getByTestId('prioritySelect')).toBeInTheDocument();

    expect(screen.getByTestId('statusLabel')).toHaveTextContent('Status');
    expect(screen.getByTestId('statusSelect')).toBeInTheDocument();

    expect(screen.getByTestId('submitButton')).toBeInTheDocument();
  });
});
