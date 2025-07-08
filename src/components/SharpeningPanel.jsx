
import React, { useState, useEffect, useRef } from 'react';
import { Focus, Sliders, Eye, Download, Upload } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import './SharpeningPanel.css';
import './shared-styles.css';

const SharpeningPanel = () => {
  const [sharpeningData, setSharpeningData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [intensity, setIntensity] = useState(50);
  const [showComparison, setShowComparison] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      fetchSharpeningData(file);
    }
  };

  const fetchSharpeningData = async (imageFile) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('intensity', intensity);

      const response = await fetch('http://localhost:5000/api/sharpening', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setSharpeningData(data);
      }
    } catch (error) {
      console.error('Error fetching sharpening data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharpeningData();
  }, []);

  return (
    <div className="sharpening-panel">
      <div className="module-header">
        <h1 className="module-title">Image Sharpening Panel</h1>
        <p className="module-description">
          Enhance image details and edge definition with advanced sharpening algorithms
        </p>
      </div>

      <div className="controls-panel">
        <div className="image-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button 
            className="upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} />
            Upload Image
          </button>
        </div>

        <div className="control-group">
          <label className="control-label">
            <Sliders size={16} />
            Sharpening Intensity: {intensity}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="range-slider"
          />
        </div>

        <div className="control-buttons">
          <button 
            className="control-btn primary"
            onClick={fetchSharpeningData}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : <Focus size={16} />}
            Apply Sharpening
          </button>

          <button 
            className={`control-btn secondary ${showComparison ? 'active' : ''}`}
            onClick={() => setShowComparison(!showComparison)}
          >
            <Eye size={16} />
            {showComparison ? 'Hide' : 'Show'} Comparison
          </button>

          <button className="control-btn secondary">
            <Download size={16} />
            Export Result
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <LoadingSpinner />
          <p>Applying sharpening filters...</p>
        </div>
      ) : sharpeningData ? (
        <div className="content-layout">
          <div className="image-comparison">
            {showComparison ? (
              <div className="comparison-view">
                <div className="image-container">
                  <h3>Original</h3>
                  <div className="image-frame">
                    <img 
                      src={`data:image/png;base64,${sharpeningData.original}`}
                      alt="Original image"
                      className="comparison-img"
                    />
                  </div>
                </div>
                <div className="comparison-divider">
                  <div className="divider-line"></div>
                  <div className="divider-icon">
                    <Focus size={20} />
                  </div>
                </div>
                <div className="image-container">
                  <h3>Sharpened</h3>
                  <div className="image-frame">
                    <img 
                      src={`data:image/png;base64,${sharpeningData.sharpened}`}
                      alt="Sharpened image"
                      className="comparison-img"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="single-view">
                <h3>Sharpened Result</h3>
                <div className="image-frame large">
                  <img 
                    src={`data:image/png;base64,${sharpeningData.sharpened}`}
                    alt="Sharpened image"
                    className="result-img"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="metrics-panel">
            <h3>Enhancement Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">Sharpness Increase</span>
                  <span className="metric-value">
                    +{sharpeningData.metrics.sharpness_increase.toFixed(1)}%
                  </span>
                </div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill sharpness"
                    style={{ width: `${sharpeningData.metrics.sharpness_increase}%` }}
                  ></div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">Edge Enhancement</span>
                  <span className="metric-value">
                    +{sharpeningData.metrics.edge_enhancement.toFixed(1)}%
                  </span>
                </div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill edge"
                    style={{ width: `${sharpeningData.metrics.edge_enhancement}%` }}
                  ></div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">Noise Level</span>
                  <span className="metric-value">
                    {sharpeningData.metrics.noise_level.toFixed(1)}%
                  </span>
                </div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill noise"
                    style={{ width: `${sharpeningData.metrics.noise_level * 10}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="quality-assessment">
              <h4>Quality Assessment</h4>
              <div className="quality-score">
                <div className="score-circle">
                  <div className="score-value">8.7</div>
                  <div className="score-label">Quality Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SharpeningPanel;
