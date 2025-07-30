import { NavLink } from 'react-router-dom';
import React from 'react';

export default function Navbar() {
  const navLinkClass = ({ isActive }) =>
  isActive
      ? 'text-blue-600 font-semibold hover:text-blue-700'
      : 'text-gray-700 hover:text-blue-700';
  
  return (
    <div className='bg-gray-200 grid grid-cols-24 grid-rows-1 gap-4 p-5 sticky top-0 z-20'>
      <div className='col-span-2 col-start-2 col-end-8 justify-self-auto'>
        <NavLink to='/' className='font-bold'>
          <h1>Hq Attendance Manager</h1>
        </NavLink>
      </div>

      <ul className='flex justify-between col-start-9 col-end-18 font-jetbrain font-normal w-full'>
        <NavLink to='/' className={navLinkClass}>
          <li>Home</li>
        </NavLink>

        <NavLink to='/signup' className={navLinkClass}>
          <li>Sign Up</li>
        </NavLink>

        <NavLink to='/signin' className={navLinkClass}>
          <li>Sign In</li>
        </NavLink>

        <NavLink to='/upload' className={navLinkClass}>
          <li>Upload</li>
        </NavLink>

        <NavLink to='/report' className={navLinkClass}>
          <li>Report</li>
        </NavLink>

        <NavLink to='/dashboard' className={navLinkClass}>
          <li>Dashboard</li>
        </NavLink>
      </ul>
    </div>
  );
}
