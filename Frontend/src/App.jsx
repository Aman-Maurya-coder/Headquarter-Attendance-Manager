import { useState } from "react";
import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Navbar from "./Components/Navbar";
import Report from "./pages/Report";
import Upload from "./pages/Upload";
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
      <AppContent />
    </BrowserRouter>
  );
}

export default App;