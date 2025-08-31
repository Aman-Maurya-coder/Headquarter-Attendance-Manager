import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <SignUp path="/signup" routing="path" signInUrl="/signup"  fallbackRedirectUrl="/upload" />
    </div>
  );
};

export default SignUpPage;