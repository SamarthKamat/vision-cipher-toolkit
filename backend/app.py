
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import json
import numpy as np
from PIL import Image
import io
import base64
import cv2
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Utility function to convert image to base64
def image_to_base64(image_array):
    """Convert numpy array to base64 string"""
    if len(image_array.shape) == 3:
        image = Image.fromarray(image_array.astype(np.uint8))
    else:
        image = Image.fromarray(image_array.astype(np.uint8), mode='L')
    
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    buffer.seek(0)
    return base64.b64encode(buffer.getvalue()).decode()

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Image Analysis Toolkit API is running"})

@app.route('/api/bitplanes', methods=['POST'])
def bitplane_analysis():
    """Bit-plane analysis endpoint"""
    try:
        # Simulate bit-plane decomposition
        # Create sample data for demonstration
        original_shape = (256, 256)
        bit_planes = []
        
        for i in range(8):
            # Generate sample bit plane data
            plane = np.random.randint(0, 2, original_shape) * 255
            bit_planes.append({
                'plane': i,
                'image': image_to_base64(plane),
                'energy': float(np.sum(plane) / (255 * original_shape[0] * original_shape[1]))
            })
        
        return jsonify({
            'success': True,
            'bit_planes': bit_planes,
            'analysis': {
                'total_planes': 8,
                'significant_planes': 6,
                'compression_ratio': 0.75
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/fourier', methods=['POST'])
def fourier_analysis():
    """Fourier transform analysis endpoint"""
    try:
        # Generate sample Fourier analysis data
        freq_data = np.random.random((128, 128)) * 255
        magnitude_spectrum = np.random.random((128, 128)) * 255
        phase_spectrum = np.random.random((128, 128)) * 255
        
        return jsonify({
            'success': True,
            'frequency_domain': image_to_base64(freq_data),
            'magnitude_spectrum': image_to_base64(magnitude_spectrum),
            'phase_spectrum': image_to_base64(phase_spectrum),
            'analysis': {
                'dominant_frequency': 0.25,
                'energy_concentration': 0.82,
                'phase_coherence': 0.67
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/sharpening', methods=['POST'])
def image_sharpening():
    """Image sharpening analysis endpoint"""
    try:
        # Generate sample sharpening results
        original = np.random.randint(0, 255, (256, 256, 3))
        sharpened = np.clip(original * 1.2, 0, 255)
        
        return jsonify({
            'success': True,
            'original': image_to_base64(original),
            'sharpened': image_to_base64(sharpened),
            'metrics': {
                'sharpness_increase': 25.3,
                'edge_enhancement': 18.7,
                'noise_level': 2.4
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/segmentation', methods=['POST'])
def edge_segmentation():
    """Edge detection and segmentation endpoint"""
    try:
        # Generate sample segmentation results
        edges = np.random.randint(0, 255, (256, 256))
        segments = np.random.randint(0, 5, (256, 256)) * 50
        
        return jsonify({
            'success': True,
            'edges': image_to_base64(edges),
            'segments': image_to_base64(segments),
            'analysis': {
                'edge_count': 1247,
                'segment_count': 23,
                'avg_segment_size': 2890.5
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/intrusion', methods=['GET'])
def intrusion_detection():
    """Intrusion detection system data endpoint"""
    try:
        # Generate sample IDS data
        alerts = [
            {'id': 1, 'severity': 'high', 'type': 'Port Scan', 'source': '192.168.1.100', 'timestamp': '2024-01-15T10:30:00Z'},
            {'id': 2, 'severity': 'medium', 'type': 'Brute Force', 'source': '10.0.0.50', 'timestamp': '2024-01-15T10:25:00Z'},
            {'id': 3, 'severity': 'low', 'type': 'Anomalous Traffic', 'source': '172.16.0.25', 'timestamp': '2024-01-15T10:20:00Z'}
        ]
        
        stats = {
            'total_alerts': 156,
            'high_severity': 12,
            'medium_severity': 34,
            'low_severity': 110,
            'blocked_attempts': 89
        }
        
        return jsonify({
            'success': True,
            'alerts': alerts,
            'statistics': stats,
            'network_activity': [45, 67, 34, 78, 56, 89, 45, 67, 34, 78]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/malware', methods=['POST'])
def malware_analysis():
    """Malware static analysis endpoint"""
    try:
        # Generate sample malware analysis results
        analysis_results = {
            'file_info': {
                'name': 'suspicious_file.exe',
                'size': '2.4 MB',
                'md5': 'a1b2c3d4e5f6789012345678901234567',
                'sha1': '1234567890abcdef1234567890abcdef12345678',
                'file_type': 'PE32 executable'
            },
            'threat_indicators': [
                {'type': 'Registry Modification', 'severity': 'high', 'description': 'Modifies system registry'},
                {'type': 'Network Activity', 'severity': 'medium', 'description': 'Connects to suspicious domains'},
                {'type': 'File System', 'severity': 'low', 'description': 'Creates temporary files'}
            ],
            'risk_score': 7.8,
            'classification': 'Potentially Malicious'
        }
        
        return jsonify({
            'success': True,
            'analysis': analysis_results
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
