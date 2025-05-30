import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/HomePage';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout'
import './App.css'
import TasksList from './pages/tasks/TasksList';
import EditTask from './pages/tasks/EditTask';
import CreateTask from './pages/tasks/CreateTask';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><TasksList /></PrivateRoute>} />
          <Route path="/tasks/edit/:id" element={<PrivateRoute><EditTask /></PrivateRoute>} />
          <Route path="/task/create" element={<PrivateRoute><CreateTask /></PrivateRoute>} />
        </Route>

        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
