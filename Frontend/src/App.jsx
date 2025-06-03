import { useState } from "react";
import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Navbar from "./Components/Navbar";
import Report from "./pages/Report";
import Upload from "./pages/Upload";

function App() {
  return (
    <BrowserRouter><Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Report" element={<Report />} />
        <Route path="/Upload" element={<Upload />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
