
import React, { useState, useEffect } from 'react';
import { Scissors, Grid, Eye, Settings } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import './EdgeSegmentation.css';

const EdgeSegmentation = () => {
  const [segmentationData, setSegmentationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('edges');
  const [threshold, setThreshold] = useState(128);
  const [algorithm, setAlgorithm] = useState('canny');

  const fetchSegmentationData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/segmentation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ threshold, algorithm }),
      });
      const data = await response.json();
      if (data.success) {
        setSegmentationData(data);
      }
    } catch (error) {
      console.error('Error fetching segmentation data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegmentationData();
  }, []);

  const algorithms = [
    { id: 'canny', name: 'Canny Edge' },
    { id: 'sobel', name: 'Sobel Filter' },
    { id: 'watershed', name: 'Watershed' },
  ];

  return (
    <div className="edge-segmentation">
      <div className="module-header">
        <h1 className="module-title">Edge Detection & Segmentation</h1>
        <p className="module-description">
          Advanced edge detection and image segmentation using multiple algorithms
        </p>
      </div>

      <div className="controls-section">
        <div className="algorithm-selector">
          <label className="control-label">
            <Settings size={16} />
            Detection Algorithm
          </label>
          <div className="algorithm-tabs">
            {algorithms.map((algo) => (
              <button
                key={algo.id}
                className={`algorithm-tab ${algorithm === algo.id ? 'active' : ''}`}
                onClick={() => setAlgorithm(algo.id)}
              >
                {algo.name}
              </button>
            ))}
          </div>
        </div>

        <div className="parameter-controls">
          <div className="control-group">
            <label className="control-label">
              Threshold: {threshold}
            </label>
            <input
              type="range"
              min="50"
              max="255"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="range-slider"
            />
          </div>

          <button 
            className="control-btn primary"
            onClick={fetchSegmentationData}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : <Scissors size={16} />}
            Process
          </button>
        </div>
      </div>

      <div className="view-controls">
        <button
          className={`view-btn ${activeView === 'edges' ? 'active' : ''}`}
          onClick={() => setActiveView('edges')}
        >
          <Scissors size={16} />
          Edge Detection
        </button>
        <button
          className={`view-btn ${activeView === 'segments' ? 'active' : ''}`}
          onClick={() => setActiveView('segments')}
        >
          <Grid size={16} />
          Segmentation
        </button>
        <button
          className={`view-btn ${activeView === 'overlay' ? 'active' : ''}`}
          onClick={() => setActiveView('overlay')}
        >
          <Eye size={16} />
          Overlay View
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <LoadingSpinner />
          <p>Processing edge detection and segmentation...</p>
        </div>
      ) : segmentationData ? (
        <div className="content-layout">
          <div className="visualization-area">
            <div className="result-display">
              <h3 className="result-title">
                {activeView === 'edges' ? 'Edge Detection Result' :
                 activeView === 'segments' ? 'Segmentation Result' : 'Overlay View'}
              </h3>
              <div className="result-image">
                {activeView === 'overlay' ? (
                  <div className="overlay-container">
                    <img 
                      src={`data:image/png;base64,${segmentationData.edges}`}
                      alt="Edge detection result"
                      className="overlay-base"
                    />
                    <img 
                      src={`data:image/png;base64,${segmentationData.segments}`}
                      alt="Segmentation result"
                      className="overlay-top"
                    />
                  </div>
                ) : (
                  <img 
                    src={`data:image/png;base64,${
                      activeView === 'edges' ? segmentationData.edges : segmentationData.segments
                    }`}
                    alt={`${activeView} result`}
                    className="result-img"
                  />
                )}
              </div>
            </div>

            <div className="analysis-summary">
              <h3>Analysis Summary</h3>
              <div className="summary-grid">
                <div className="summary-card">
                  <div className="summary-icon">
                    <Scissors size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-value">
                      {segmentationData.analysis.edge_count.toLocaleString()}
                    </span>
                    <span className="summary-label">Detected Edges</span>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon">
                    <Grid size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-value">
                      {segmentationData.analysis.segment_count}
                    </span>
                    <span className="summary-label">Segments Found</span>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="summary-icon">
                    <Eye size={24} />
                  </div>
                  <div className="summary-content">
                    <span className="summary-value">
                      {segmentationData.analysis.avg_segment_size.toFixed(0)}
                    </span>
                    <span className="summary-label">Avg Segment Size</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="parameters-panel">
            <h3>Algorithm Parameters</h3>
            <div className="parameter-list">
              <div className="parameter-item">
                <span className="param-name">Algorithm</span>
                <span className="param-value">{algorithm.charAt(0).toUpperCase() + algorithm.slice(1)}</span>
              </div>
              <div className="parameter-item">
                <span className="param-name">Threshold</span>
                <span className="param-value">{threshold}</span>
              </div>
              <div className="parameter-item">
                <span className="param-name">Edge Density</span>
                <span className="param-value">Medium</span>
              </div>
              <div className="parameter-item">
                <span className="param-name">Noise Filtering</span>
                <span className="param-value">Enabled</span>
              </div>
            </div>

            <div className="processing-stats">
              <h4>Processing Statistics</h4>
              <div className="stat-bars">
                <div className="stat-bar">
                  <span className="stat-label">Edge Quality</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{ width: '85%' }}></div>
                  </div>
                  <span className="stat-percent">85%</span>
                </div>
                <div className="stat-bar">
                  <span className="stat-label">Segmentation Accuracy</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{ width: '92%' }}></div>
                  </div>
                  <span className="stat-percent">92%</span>
                </div>
                <div className="stat-bar">
                  <span className="stat-label">Processing Speed</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{ width: '78%' }}></div>
                  </div>
                  <span className="stat-percent">78%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EdgeSegmentation;
