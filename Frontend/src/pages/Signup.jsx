import React from "react";
import { SignUp } from '@clerk/clerk-react';


const Signup = () => {

  return (
    <>
      <div id="SignupPage" className="p-3 max-w-lg mx-auto mt-5 text-black flex justify-center items-center h-full w-full">
        <SignUp></SignUp>
      </div>
    </>
  );
};

export default SignUpPage;