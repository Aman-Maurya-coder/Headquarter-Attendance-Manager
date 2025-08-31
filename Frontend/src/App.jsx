// Frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Report from "./pages/Report";
import ProtectedLayout from "./Components/ProtectedLayout";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

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
