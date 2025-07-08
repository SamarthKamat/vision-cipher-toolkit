
import React from 'react';
import { ChevronLeft, ChevronRight, Layers, Zap, Focus, Scissors, Shield, Bug } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeModule, setActiveModule, collapsed, setCollapsed }) => {
  const modules = [
    { id: 'bitplane', name: 'Bit-Plane Viewer', icon: Layers },
    { id: 'fourier', name: 'Fourier Explorer', icon: Zap },
    { id: 'sharpening', name: 'Sharpening Panel', icon: Focus },
    { id: 'segmentation', name: 'Edge Segmentation', icon: Scissors },
    { id: 'intrusion', name: 'Intrusion Detection', icon: Shield },
    { id: 'malware', name: 'Malware Analysis', icon: Bug },
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
              onClick={() => setActiveModule(module.id)}
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
