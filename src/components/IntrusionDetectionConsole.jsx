
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Wifi, Clock } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import './IntrusionDetectionConsole.css';

const IntrusionDetectionConsole = () => {
  const [idsData, setIdsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [realTimeData, setRealTimeData] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const fetchIdsData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/intrusion');
      const data = await response.json();
      if (data.success) {
        setIdsData(data);
        setRealTimeData(data.network_activity);
      }
    } catch (error) {
      console.error('Error fetching IDS data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdsData();
    const interval = setInterval(fetchIdsData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#7bed9f';
      default: return '#70a1ff';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertTriangle size={16} />;
      case 'medium': return <Shield size={16} />;
      case 'low': return <Activity size={16} />;
      default: return <Wifi size={16} />;
    }
  };

  return (
    <div className="intrusion-detection-console">
      <div className="module-header">
        <h1 className="module-title">Intrusion Detection System</h1>
        <p className="module-description">
          Real-time network monitoring and threat detection console
        </p>
      </div>

      <div className="console-status">
        <div className="status-card">
          <div className="status-indicator active">
            <div className="pulse-dot"></div>
          </div>
          <div className="status-info">
            <span className="status-label">System Status</span>
            <span className="status-value">Active Monitoring</span>
          </div>
        </div>
        
        <div className="last-update">
          <Clock size={16} />
          <span>Last update: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading security data...</p>
        </div>
      ) : idsData ? (
        <div className="console-layout">
          <div className="main-dashboard">
            <div className="statistics-overview">
              <div className="stat-card high">
                <div className="stat-icon">
                  <AlertTriangle size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{idsData.statistics.high_severity}</span>
                  <span className="stat-label">High Priority</span>
                </div>
              </div>

              <div className="stat-card medium">
                <div className="stat-icon">
                  <Shield size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{idsData.statistics.medium_severity}</span>
                  <span className="stat-label">Medium Priority</span>
                </div>
              </div>

              <div className="stat-card low">
                <div className="stat-icon">
                  <Activity size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{idsData.statistics.low_severity}</span>
                  <span className="stat-label">Low Priority</span>
                </div>
              </div>

              <div className="stat-card blocked">
                <div className="stat-icon">
                  <Shield size={24} />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{idsData.statistics.blocked_attempts}</span>
                  <span className="stat-label">Blocked</span>
                </div>
              </div>
            </div>

            <div className="network-activity">
              <h3>Network Activity Monitor</h3>
              <div className="activity-chart">
                <div className="chart-container">
                  {realTimeData.map((value, index) => (
                    <div 
                      key={index}
                      className="activity-bar"
                      style={{ 
                        height: `${(value / Math.max(...realTimeData)) * 100}%`,
                        animationDelay: `${index * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                <div className="chart-labels">
                  <span>10m ago</span>
                  <span>5m ago</span>
                  <span>Now</span>
                </div>
              </div>
            </div>

            <div className="alerts-feed">
              <h3>Recent Security Alerts</h3>
              <div className="alerts-list">
                {idsData.alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`alert-item ${alert.severity}`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="alert-header">
                      <div className="alert-severity">
                        {getSeverityIcon(alert.severity)}
                        <span className="severity-badge" style={{
                          backgroundColor: getSeverityColor(alert.severity)
                        }}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <span className="alert-time">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="alert-content">
                      <span className="alert-type">{alert.type}</span>
                      <span className="alert-source">Source: {alert.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="side-panel">
            <div className="threat-radar">
              <h3>Threat Level</h3>
              <div className="radar-display">
                <div className="radar-circle">
                  <div className="radar-sweep"></div>
                  <div className="threat-level">
                    <span className="threat-value">MEDIUM</span>
                    <span className="threat-desc">Active Monitoring</span>
                  </div>
                </div>
              </div>
            </div>

            {selectedAlert && (
              <div className="alert-details">
                <h3>Alert Details</h3>
                <div className="detail-card">
                  <div className="detail-header">
                    <span className="detail-title">{selectedAlert.type}</span>
                    <span 
                      className="detail-severity"
                      style={{ color: getSeverityColor(selectedAlert.severity) }}
                    >
                      {selectedAlert.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="detail-info">
                    <div className="info-row">
                      <span className="info-label">Source IP:</span>
                      <span className="info-value">{selectedAlert.source}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Timestamp:</span>
                      <span className="info-value">
                        {new Date(selectedAlert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Alert ID:</span>
                      <span className="info-value">#{selectedAlert.id}</span>
                    </div>
                  </div>
                  <div className="detail-actions">
                    <button className="action-btn primary">Investigate</button>
                    <button className="action-btn secondary">Block IP</button>
                    <button className="action-btn secondary">Dismiss</button>
                  </div>
                </div>
              </div>
            )}

            <div className="system-health">
              <h3>System Health</h3>
              <div className="health-metrics">
                <div className="health-item">
                  <span className="health-label">CPU Usage</span>
                  <div className="health-bar">
                    <div className="health-fill" style={{ width: '34%' }}></div>
                  </div>
                  <span className="health-value">34%</span>
                </div>
                <div className="health-item">
                  <span className="health-label">Memory</span>
                  <div className="health-bar">
                    <div className="health-fill" style={{ width: '67%' }}></div>
                  </div>
                  <span className="health-value">67%</span>
                </div>
                <div className="health-item">
                  <span className="health-label">Network I/O</span>
                  <div className="health-bar">
                    <div className="health-fill" style={{ width: '28%' }}></div>
                  </div>
                  <span className="health-value">28%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default IntrusionDetectionConsole;
