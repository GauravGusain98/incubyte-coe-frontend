import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className='px-8'>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
