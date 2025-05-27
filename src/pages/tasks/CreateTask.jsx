import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';

const CreateTask = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    priority: '',
    dueDate: '',
    description: '',
    startDate: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axiosInstance.post('/task/add', form);
      navigate('/tasks');
    } catch (err) {
      setError('Failed to create task. Please try again.');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Task</h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex justify-self-start mb-1 font-medium">Task Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="flex justify-self-start mb-1 font-medium">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div>
          <label className="flex justify-self-start mb-1 font-medium">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select Status</option>
            <option value="pending">Low</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Complete</option>
          </select>
        </div>

        <div>
          <label className="flex justify-self-start mb-1 font-medium">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="flex justify-self-start mb-1 font-medium">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="flex justify-self-start mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="border p-2 w-full rounded"
            placeholder="Enter task description..."
          />
        </div>

        <button
          type="submit"
          className="bg-primary-light text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
