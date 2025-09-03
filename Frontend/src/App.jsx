// Frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import HomeNavbar from "./Components/HomeNavbar"; // Create this component for Home page
import { SignedIn, SignedOut, SignInButton, UserButton, SignIn, SignUp } from '@clerk/clerk-react'


function AppContent() {
  const location = useLocation();
  // Show HomeNavbar only on home page, Navbar on all others
  const isHome = location.pathname === "/";

  return (
    <>
      {isHome ? <HomeNavbar /> : <Navbar />}
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/Report" element={<Report />} />
          <Route path="/Upload" element={<Upload />} />
          <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Home />} />

        {/* Signin: redirect if already signed in */}
        <Route
          path="/signin/*"
          element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
              <SignedOut>
                <Signin />
              </SignedOut>
            </>
          }
        />

        {/* Signup: redirect if already signed in */}
        <Route
          path="/signup/*"
          element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
              <SignedOut>
                <Signup />
              </SignedOut>
            </>
          }
        />

        {/* --- Protected Routes --- */}
        <Route
          element={
            <>
              <SignedIn>
                <ProtectedLayout />
              </SignedIn>
              <SignedOut>
                <Navigate to="/" replace />
              </SignedOut>
            </>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/report" element={<Report />} />
        </Route>

        {/* --- Fallback for unknown routes --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
