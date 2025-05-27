import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

const CreateTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      await axiosInstance.post('/task/add', data);
      reset(); // Clear form
      navigate('/tasks');
    } catch (err) {
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Task</h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="flex justify-self-start mb-1 font-medium">Task Name</label>
          <input
            type="text"
            {...register('name', { required: 'Task name is required' })}
            className="border p-2 w-full rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="flex justify-self-start mb-1 font-medium">Priority</label>
          <select
            {...register('priority', { required: 'Priority is required' })}
            className="border p-2 w-full rounded"
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
        </div>

        <div>
          <label className="flex justify-self-start mb-1 font-medium">Status</label>
          <select
            {...register('status', { required: 'Status is required' })}
            className="border p-2 w-full rounded"
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
        </div>

        <div>
          <label className="flex justify-self-start mb-1 font-medium">Start Date</label>
          <input
            type="date"
            {...register('startDate', { required: 'Start date is required' })}
            className="border p-2 w-full rounded"
          />
          {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
        </div>

        <div>
          <label className="flex justify-self-start mb-1 font-medium">Due Date</label>
          <input
            type="date"
            {...register('dueDate', { required: 'Due date is required' })}
            className="border p-2 w-full rounded"
          />
          {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
        </div>

        <div>
          <label className="flex justify-self-start mb-1 font-medium">Description</label>
          <textarea
            {...register('description')}
            rows="4"
            className="border p-2 w-full rounded"
            placeholder="Enter task description..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-primary-light text-white px-4 py-2 rounded hover:bg-primary-dark ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
