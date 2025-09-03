import React from "react";
import { SignIn } from '@clerk/clerk-react';

const Signin = () => {
  return (
    <>
      <div className="p-3 max-w-lg mx-auto mt-6 text-black">
        <SignIn forceRedirectUrl="/dashboard" />
      </div>
    </>
  );
};

export default SignInPage;