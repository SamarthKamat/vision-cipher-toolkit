
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import './BitPlaneViewer.css';

const BitPlaneViewer = () => {
  const [bitPlanes, setBitPlanes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlane, setSelectedPlane] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const fetchBitPlaneData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/bitplanes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (data.success) {
        setBitPlanes(data.bit_planes);
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Error fetching bit-plane data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAnimation = () => {
    setAnimating(true);
    let currentPlane = 0;
    const interval = setInterval(() => {
      setSelectedPlane(currentPlane);
      currentPlane = (currentPlane + 1) % 8;
      if (currentPlane === 0 && animating) {
        clearInterval(interval);
        setAnimating(false);
      }
    }, 800);
  };

  useEffect(() => {
    fetchBitPlaneData();
  }, []);

  return (
    <div className="bitplane-viewer">
      <div className="module-header">
        <h1 className="module-title">Bit-Plane Analysis</h1>
        <p className="module-description">
          Decompose images into individual bit planes to analyze information distribution
        </p>
      </div>

      <div className="controls-panel">
        <button 
          className="control-btn primary"
          onClick={fetchBitPlaneData}
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="small" /> : 'Analyze Image'}
        </button>
        
        <button 
          className="control-btn secondary"
          onClick={startAnimation}
          disabled={animating || bitPlanes.length === 0}
        >
          {animating ? <Pause size={16} /> : <Play size={16} />}
          {animating ? 'Animating...' : 'Animate Planes'}
        </button>

        <button className="control-btn secondary">
          <RotateCcw size={16} />
          Reset
        </button>

        <button className="control-btn secondary">
          <Download size={16} />
          Export
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <LoadingSpinner />
          <p>Processing bit-plane decomposition...</p>
        </div>
      ) : (
        <div className="content-grid">
          <div className="bitplane-grid">
            {bitPlanes.map((plane, index) => (
              <div 
                key={index}
                className={`bitplane-card ${selectedPlane === index ? 'active' : ''}`}
                onClick={() => setSelectedPlane(index)}
              >
                <div className="plane-header">
                  <h3>Bit Plane {plane.plane}</h3>
                  <span className="energy-badge">
                    {(plane.energy * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="plane-image">
                  <img 
                    src={`data:image/png;base64,${plane.image}`}
                    alt={`Bit plane ${plane.plane}`}
                    className="bitplane-img"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="analysis-panel">
            <h2>Analysis Results</h2>
            {analysis && (
              <div className="metrics-grid">
                <div className="metric-card">
                  <span className="metric-label">Total Planes</span>
                  <span className="metric-value">{analysis.total_planes}</span>
                </div>
                <div className="metric-card">
                  <span className="metric-label">Significant Planes</span>
                  <span className="metric-value">{analysis.significant_planes}</span>
                </div>
                <div className="metric-card">
                  <span className="metric-label">Compression Ratio</span>
                  <span className="metric-value">{(analysis.compression_ratio * 100).toFixed(0)}%</span>
                </div>
              </div>
            )}
            
            {bitPlanes[selectedPlane] && (
              <div className="selected-plane-info">
                <h3>Plane {selectedPlane} Details</h3>
                <div className="energy-bar">
                  <div className="energy-label">Information Energy</div>
                  <div className="energy-progress">
                    <div 
                      className="energy-fill"
                      style={{ width: `${bitPlanes[selectedPlane].energy * 100}%` }}
                    ></div>
                  </div>
                  <span className="energy-percent">
                    {(bitPlanes[selectedPlane].energy * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BitPlaneViewer;
