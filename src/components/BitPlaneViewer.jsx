import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Download, Upload } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import './BitPlaneViewer.css';

const API_URL = import.meta.env.VITE_API_URL;

const BitPlaneViewer = () => {
  const [bitPlanes, setBitPlanes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlane, setSelectedPlane] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      processBitPlanes(file);
    }
  };

  const [error, setError] = useState(null);

  const processBitPlanes = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/api/bitplanes`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setBitPlanes(data.bit_planes);
        setAnalysis(data.analysis);
        setSelectedPlane(0);
      } else {
        setError(data.error || 'Failed to process image');
        setBitPlanes([]);
        setAnalysis(null);
      }
    } catch (error) {
      console.error('Error processing bit-planes:', error);
      setError('Network error. Please try again.');
      setBitPlanes([]);
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setBitPlanes([]);
    setAnalysis(null);
    setSelectedPlane(0);
    setAnimating(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = async () => {
    if (!bitPlanes.length) return;

    try {
      // Create a zip file containing all bit planes
      const zip = new JSZip();
      const analysisFolder = zip.folder('bit-plane-analysis');

      // Add each bit plane image
      bitPlanes.forEach((plane) => {
        const imageData = plane.image.split(',')[1]; // Remove data URL prefix
        analysisFolder.file(`bit_plane_${plane.plane}.png`, imageData, {base64: true});
      });

      // Add analysis report
      if (analysis) {
        const report = JSON.stringify(analysis, null, 2);
        analysisFolder.file('analysis_report.json', report);
      }

      // Generate and download the zip file
      const content = await zip.generateAsync({type: 'blob'});
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bit-plane-analysis.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to export analysis. Please try again.');
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

  // No initial data fetch needed, waiting for user to upload image

  return (
    <div className="bitplane-viewer">
      <div className="module-header">
        <h1 className="module-title">Bit-Plane Analysis</h1>
        <p className="module-description">
          Decompose images into individual bit planes to analyze information distribution
        </p>
      </div>

      <div className="controls-panel">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/png,image/jpeg,image/bmp,image/tiff"
          style={{ display: 'none' }}
        />
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        <div className="button-group">
          <button 
            className="control-btn primary"
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" /> : (
              <>
                <Upload size={16} />
                Upload Image
              </>
            )}
          </button>
          
          <button
            className="control-btn secondary"
            onClick={handleReset}
            disabled={loading || !selectedImage}
          >
            <RotateCcw size={16} /> Reset
          </button>

          <button
            className="control-btn secondary"
            onClick={handleExport}
            disabled={loading || !bitPlanes.length}
          >
            <Download size={16} /> Export
          </button>
        </div>
        
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
