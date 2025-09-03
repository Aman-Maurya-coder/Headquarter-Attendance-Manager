import React from 'react'
import { useNavigate } from 'react-router-dom';
import { SignUpButton, SignInButton } from '@clerk/clerk-react';
;
const HomeNavbar = () => {
  const navigate = useNavigate();

  return (

    <header className="grid grid-cols-12 grid-rows-1 gap-4 pt-4 px-2 lg:px-20">
      <div className="col-span-3 text-center text-xl">HQ attendance manager</div>
      <button onClick={() => { navigate("/signin") }} className="col-start-11 hover:text-gray-200 ransition-colors cursor-pointer z-50">Log In</button>
      <button onClick={() => { navigate("/signup") }} className="col-start-12 bg-gray-300 p-[7px] text-gray-900 rounded-md hover:bg-gray-50 transition-colors cursor-pointer z-50" >Sign up</button>
      {/* <SignUpButton className="col-start-11 hover:text-gray-200 ransition-colors cursor-pointer z-50">Log In</SignUpButton>
      <SignInButton className="col-start-12 bg-gray-300 p-[7px] text-gray-900 rounded-md hover:bg-gray-50 transition-colors cursor-pointer z-50" >Sign up</SignInButton> */}
    </header>

  )
}

export default HomeNavbar;
