// Frontend/src/Components/ProtectedLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Your main navbar for authenticated pages

const ProtectedLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        {/* This will render the specific page component (Dashboard, Upload, etc.) */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default ProtectedLayout;