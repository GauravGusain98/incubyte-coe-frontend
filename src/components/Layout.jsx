import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';  // Your Navbar component file

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* renders the matched child route */}
      </main>
    </>
  );
};

export default Layout;
