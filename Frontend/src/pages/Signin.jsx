import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <SignIn path="/signin" routing="path" signUpUrl="/signin" fallbackRedirectUrl="/upload" />
    </div>
  );
};

export default SignInPage;