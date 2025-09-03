import { NavLink } from 'react-router-dom';
import React from 'react';
import profile from '../assets/profile.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserButton } from '@clerk/clerk-react';

export default function Navbar() {
  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-blue-600 font-semibold hover:transition duration-300 hover:text-blue-700'
      : 'text-gray-200 hover:text-blue-700 hover:transition duration-300';

  return (
    <div className='bg-black grid grid-cols-24 grid-rows-1 gap-4 p-4 sticky top-0 z-20'>
      <div className='col-span-2 col-start-2 col-end-8 justify-self-auto flex items-center'>
        <NavLink to='/' className='font-bold text-white'>
          <h1>Hq Attendance Manager</h1>
        </NavLink>
      </div>

      <ul className='flex justify-between col-start-9 col-end-18 font-jetbrain font-normal w-full items-center text-white'>
        <NavLink to='/' className={navLinkClass}>
          <li>Home</li>
        </NavLink>

        {/* <NavLink to='/signup' className={navLinkClass}>
          <li>Sign Up</li>
        </NavLink> */}

        {/* <NavLink to='/signin' className={navLinkClass}>
          <li>Sign In</li>
        </NavLink> */}

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
      <div className='col-start-23 w-8 bg-white'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><img src={profile}></img></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
      <UserButton></UserButton>
    </div>
  );
}
