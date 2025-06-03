import { Link } from 'react-router-dom';
import React from 'react'

// import { useSelector } from 'react-redux';

export default function Navbar() {
  // const { currentUser } = useSelector((state) => state.user);
  return (
    <div className='bg-blue-50'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3 '>
        <Link to='/'>
          <h1 className='font-bold'>Hq Attendance Manager</h1>
        </Link>
        <ul className='flex gap-6'>
          <Link to='/'>
            <li>Home</li>
          </Link>
          <Link to='/Signup'>
            <li>Sign Up</li>
          </Link>
          <Link to='/Signin'>
            <li>Sign In</li>
          </Link>
          <Link to='/upload'>
            <li>Upload</li>
          </Link>
          <Link to='/report'>
            <li>Report</li>
          </Link>
          <Link to='/signin'>
            {/* {currentUser ? (
              <img src={currentUser.profilePicture} alt='profile' className='h-7 w-7 rounded-full object-cover' />
            ) : ( */}
            {/* <li>Sign In</li>
            )} */}
          </Link>
        </ul>
      </div>
    </div>
  );
}