import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';

const TasksList = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: null,
    sortBy: null,
    sortOrder: null
  });

  const fetchTasks = useCallback(async () => {
    try {
      const params = {
        page,
        records_per_page: 10,
        ...filters,
      };
      const { data } = await axiosInstance.get('/task/list', { params });
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters((prev) => ({ ...prev, search: value }));
      setPage(1);
    }, 400),
    []
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axiosInstance.delete(`/task/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset pagination when filters change
  };

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Task List</h2>
        <Link to="/task/create" className="bg-brand-light text-white px-4 py-2 rounded hover:bg-brand-dark">
          + Create Task
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded"
          onChange={(e) => debouncedSearch(e.target.value)}
        />
        <select
          className="border w-[120px] p-2 rounded"
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="name">Name</option>
        </select>
        <select
          className="border w-[130px] p-2 rounded"
          onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
        >
          <option value="">Order</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <table className="w-full table-fixed border">
        <thead className="bg-gray-200">
          <tr>
            <th className="w-1/6 md:w-1/2 p-2 text-left">Name</th>
            <th className="w-1/6 p-2 text-left">Priority</th>
            <th className="w-1/6 p-2 text-left">Due Date</th>
            <th className="w-1/6 p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id} className="border-b">
                <td className="w-1/6 md:w-1/2 p-2 text-left">{task.name}</td>
                <td className="w-1/6 p-2 text-left">{task.priority}</td>
                <td className="w-1/6 p-2 text-left">{task.dueDate}</td>
                <td className="w-1/6 p-2 text-left space-x-2">
                  <Link to={`/tasks/edit/${task.id}`} className="text-primary-dark hover:underline">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(task.id)} className="text-danger-dark hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-4 flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={page === pagination.totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TasksList;
