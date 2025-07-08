
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import BitPlaneViewer from '../components/BitPlaneViewer';
import FourierExplorer from '../components/FourierExplorer';
import SharpeningPanel from '../components/SharpeningPanel';
import EdgeSegmentation from '../components/EdgeSegmentation';
import IntrusionDetectionConsole from '../components/IntrusionDetectionConsole';
import MalwareStaticAnalysis from '../components/MalwareStaticAnalysis';
import './Index.css';

const Index = () => {
  const [activeModule, setActiveModule] = useState('bitplane');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'bitplane':
        return <BitPlaneViewer />;
      case 'fourier':
        return <FourierExplorer />;
      case 'sharpening':
        return <SharpeningPanel />;
      case 'segmentation':
        return <EdgeSegmentation />;
      case 'intrusion':
        return <IntrusionDetectionConsole />;
      case 'malware':
        return <MalwareStaticAnalysis />;
      default:
        return <BitPlaneViewer />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="module-container">
          {renderActiveModule()}
        </div>
      </main>
    </div>
  );
};

export default Index;
