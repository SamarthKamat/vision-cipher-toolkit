
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Index.css';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const activeModule = location.pathname.split('/')[1] || 'bit-planes';

  return (
    <div className="app-container">
      <Sidebar 
        activeModule={activeModule}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="module-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Index;
