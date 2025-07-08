
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Layers, Zap, Focus, Scissors, Shield, Bug } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeModule, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const modules = [
    { id: 'bit-planes', name: 'Bit-Plane Viewer', icon: Layers, path: '/bit-planes' },
    { id: 'fourier', name: 'Fourier Explorer', icon: Zap, path: '/fourier' },
    { id: 'sharpening', name: 'Sharpening Panel', icon: Focus, path: '/sharpening' },
    { id: 'edge-segmentation', name: 'Edge Segmentation', icon: Scissors, path: '/edge-segmentation' },
    { id: 'intrusion-detection', name: 'Intrusion Detection', icon: Shield, path: '/intrusion-detection' },
    { id: 'malware-analysis', name: 'Malware Analysis', icon: Bug, path: '/malware-analysis' },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">🔍</div>
          {!collapsed && <span className="logo-text">SecureVision</span>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {modules.map((module) => {
          const IconComponent = module.icon;
          return (
            <button
              key={module.id}
              className={`nav-item ${activeModule === module.id ? 'active' : ''}`}
              onClick={() => navigate(module.path)}
              title={collapsed ? module.name : ''}
              aria-label={module.name}
            >
              <IconComponent size={20} className="nav-icon" />
              {!collapsed && <span className="nav-text">{module.name}</span>}
            </button>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <div className="status-indicator">
          <div className="status-dot"></div>
          {!collapsed && <span className="status-text">System Online</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
