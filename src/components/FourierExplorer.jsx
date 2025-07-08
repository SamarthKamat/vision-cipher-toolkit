import React, { useState, useEffect } from 'react';
import { Zap, BarChart3, Settings, Eye } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { mockApi } from '../services/mockApi';
import './FourierExplorer.css';

const FourierExplorer = () => {
  const [fourierData, setFourierData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('magnitude');
  const [filterRadius, setFilterRadius] = useState(50);

  const fetchFourierData = async () => {
    setLoading(true);
    try {
      const data = await mockApi.fetchFourierData(filterRadius);
      if (data.success) {
        setFourierData(data);
      }
    } catch (error) {
      console.error('Error fetching Fourier data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFourierData();
  }, []);

  const views = [
    { id: 'magnitude', name: 'Magnitude Spectrum', icon: BarChart3 },
    { id: 'phase', name: 'Phase Spectrum', icon: Zap },
    { id: 'frequency', name: 'Frequency Domain', icon: Eye },
  ];

  return (
    <div className="fourier-explorer">
      <div className="module-header">
        <h1 className="module-title">Fourier Transform Explorer</h1>
        <p className="module-description">
          Analyze frequency domain characteristics and spectral properties of images
        </p>
      </div>

      <div className="controls-section">
        <div className="view-selector">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                className={`view-btn ${activeView === view.id ? 'active' : ''}`}
                onClick={() => setActiveView(view.id)}
              >
                <Icon size={16} />
                {view.name}
              </button>
            );
          })}
        </div>

        <div className="parameter-controls">
          <div className="control-group">
            <label className="control-label">
              <Settings size={16} />
              Filter Radius: {filterRadius}
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={filterRadius}
              onChange={(e) => setFilterRadius(Number(e.target.value))}
              className="range-slider"
            />
          </div>
          
          <button 
            className="control-btn primary"
            onClick={fetchFourierData}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : 'Analyze'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <LoadingSpinner />
          <p>Computing Fourier transform...</p>
        </div>
      ) : fourierData ? (
        <div className="content-layout">
          <div className="visualization-area">
            <div className="spectrum-display">
              <h3 className="spectrum-title">
                {views.find(v => v.id === activeView)?.name}
              </h3>
              <div className="spectrum-image">
                <img 
                  src={`data:image/png;base64,${
                    activeView === 'magnitude' ? fourierData.magnitude_spectrum :
                    activeView === 'phase' ? fourierData.phase_spectrum :
                    fourierData.frequency_domain
                  }`}
                  alt={`${activeView} spectrum`}
                  className="spectrum-img"
                />
              </div>
            </div>

            <div className="frequency-analysis">
              <h3>Frequency Analysis</h3>
              <div className="analysis-grid">
                <div className="analysis-card">
                  <div className="analysis-icon">
                    <Zap size={24} />
                  </div>
                  <div className="analysis-content">
                    <span className="analysis-label">Dominant Frequency</span>
                    <span className="analysis-value">
                      {(fourierData.analysis.dominant_frequency * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="analysis-card">
                  <div className="analysis-icon">
                    <BarChart3 size={24} />
                  </div>
                  <div className="analysis-content">
                    <span className="analysis-label">Energy Concentration</span>
                    <span className="analysis-value">
                      {(fourierData.analysis.energy_concentration * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="analysis-card">
                  <div className="analysis-icon">
                    <Eye size={24} />
                  </div>
                  <div className="analysis-content">
                    <span className="analysis-label">Phase Coherence</span>
                    <span className="analysis-value">
                      {(fourierData.analysis.phase_coherence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-panel">
            <div className="frequency-controls">
              <h3>Filter Controls</h3>
              <div className="filter-presets">
                <button 
                  className="preset-btn"
                  onClick={() => setFilterRadius(25)}
                >
                  Low Pass
                </button>
                <button 
                  className="preset-btn"
                  onClick={() => setFilterRadius(75)}
                >
                  High Pass
                </button>
                <button 
                  className="preset-btn"
                  onClick={() => setFilterRadius(50)}
                >
                  Band Pass
                </button>
              </div>
            </div>

            <div className="spectrum-stats">
              <h3>Spectrum Statistics</h3>
              <div className="stat-item">
                <span className="stat-label">Peak Frequency</span>
                <span className="stat-value">0.125 Hz</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Bandwidth</span>
                <span className="stat-value">2.4 kHz</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">SNR</span>
                <span className="stat-value">34.2 dB</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FourierExplorer;
