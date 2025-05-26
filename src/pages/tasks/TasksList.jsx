import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { Link } from 'react-router-dom';

const TasksList = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({ search: '', sort_by: '', sort_order: '' });
  const [page, setPage] = useState(1);

  const fetchTasks = async () => {
    const params = {
      page,
      records_per_page: 10,
      ...filters,
    };
    const response = await axiosInstance.get('/task/list', { params });
    setTasks(response.data.tasks);
    setPagination(response.data.pagination);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    await axiosInstance.delete(`/task/${id}`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, [filters, page]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Task List</h2>
        <Link to="/task/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Create Task
        </Link>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded"
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          className="border w-[120px] p-2 rounded"
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="">Sort By</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
        <select
          className="border w-[130px] p-2 rounded"
          onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
        >
          <option value="">Order</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Priority</th>
            <th className="p-2">Due Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id} className="border-b">
              <td className="p-2">{task.name}</td>
              <td className="p-2">{task.priority}</td>
              <td className="p-2">{task.dueDate}</td>
              <td className="p-2 space-x-2">
                <Link to={`/tasks/edit/${task.id}`} className="text-blue-500 hover:underline">Edit</Link>
                <button onClick={() => handleDelete(task.id)} className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >Previous</button>
        <button
          disabled={page === pagination.total_pages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >Next</button>
      </div>
    </div>
  );
};

export default TasksList;
