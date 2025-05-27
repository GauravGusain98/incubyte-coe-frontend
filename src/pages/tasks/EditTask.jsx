import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    await axiosInstance.put(`/task/${id}`, data);
    navigate('/tasks');
  };

  const fetchTask = async () => {
    const response = await axiosInstance.get(`/task/${id}`);
    reset(response.data);
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  return (
    <div className="py-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="flex justify-self-start font-medium mb-1">Name</label>
          <input {...register('name')} placeholder="Name" className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="flex justify-self-start font-medium mb-1">Description</label>
          <textarea {...register('description')} placeholder="Description" className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="flex justify-self-start font-medium mb-1">Start Date</label>
          <input type="date" {...register('startDate')} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="flex justify-self-start font-medium mb-1">Due Date</label>
          <input type="date" {...register('dueDate')} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="flex justify-self-start font-medium mb-1">Priority</label>
          <select {...register('priority')} className="w-full border p-2 rounded">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="flex justify-self-start font-medium mb-1">Status</label>
          <select {...register('status')} className="w-full border p-2 rounded">
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button type="submit" className="bg-primary-light hover:bg-primary-dark text-white px-4 py-2 rounded">Update</button>
      </form>
    </div>
  );
};

export default EditTask;
