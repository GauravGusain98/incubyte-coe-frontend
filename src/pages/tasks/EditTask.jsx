import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    try {
      await axiosInstance.put(`/task/${id}`, data);
      navigate('/tasks');
    } catch {
      setError('Failed to update task. Please try again.');
    }
  };

  const fetchTask = async () => {
    try {
      const response = await axiosInstance.get(`/task/${id}`);
      reset(response.data);
    } catch {
      setError('Failed to fetch task data.');
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  return (
    <div className="py-4 max-w-xl mx-auto" data-testid="editTaskContainer">
      <h2 className="text-2xl font-bold mb-4" data-testid="heading">Edit Task</h2>
      {error && <div data-testid="errorMessage" className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="editTaskForm">
        <div>
          <label data-testid="nameLabel" className="flex justify-self-start font-medium mb-1">Name</label>
          <input
            {...register('name')}
            placeholder="Name"
            className="w-full border p-2 rounded"
            data-testid="nameInput"
          />
        </div>

        <div>
          <label data-testid="descriptionLabel" className="flex justify-self-start font-medium mb-1">Description</label>
          <textarea
            {...register('description')}
            placeholder="Description"
            className="w-full border p-2 rounded"
            data-testid="descriptionTextarea"
          />
        </div>

        <div>
          <label data-testid="startDateLabel" className="flex justify-self-start font-medium mb-1">Start Date</label>
          <input
            type="date"
            {...register('startDate')}
            className="w-full border p-2 rounded"
            data-testid="startDateInput"
          />
        </div>

        <div>
          <label data-testid="dueDateLabel" className="flex justify-self-start font-medium mb-1">Due Date</label>
          <input
            type="date"
            {...register('dueDate')}
            className="w-full border p-2 rounded"
            data-testid="dueDateInput"
          />
        </div>

        <div>
          <label data-testid="priorityLabel" className="flex justify-self-start font-medium mb-1">Priority</label>
          <select
            {...register('priority')}
            className="w-full border p-2 rounded"
            data-testid="prioritySelect"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label data-testid="statusLabel" className="flex justify-self-start font-medium mb-1">Status</label>
          <select
            {...register('status')}
            className="w-full border p-2 rounded"
            data-testid="statusSelect"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-primary-light hover:bg-primary-dark text-white px-4 py-2 rounded"
          data-testid="submitButton"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditTask;
