from flask import Flask, request, jsonify, send_file, send_from_directory
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

app = Flask(__name__, static_folder='../dist')
CORS(app)  # Enable CORS for all routes

# Serve React App
@app.route('/')
def serve_react_app():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

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
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image file provided'}), 400

        file = request.files['image']
        if not file.filename:
            return jsonify({'success': False, 'error': 'Empty file provided'}), 400

        # Load configuration from environment variables
        from dotenv import load_dotenv
        load_dotenv()
        
        max_size = int(os.getenv('MAX_IMAGE_SIZE', 4096))
        allowed_formats = set(os.getenv('ALLOWED_IMAGE_FORMATS', 'png,jpg,jpeg,bmp,tiff').split(','))
        
        # Check file extension
        file_ext = os.path.splitext(file.filename)[1].lower().lstrip('.')
        if file_ext not in allowed_formats:
            return jsonify({
                'success': False, 
                'error': f'Invalid file format. Allowed formats: {", ".join(allowed_formats).upper()}'
            }), 400

        # Read image directly with cv2 from the uploaded file
        file_bytes = file.read()
        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)

        if img is None:
            return jsonify({
                'success': False, 
                'error': 'Error loading image. Please ensure the image is valid.'
            }), 400

        # Check image dimensions
        if img.shape[0] * img.shape[1] > max_size * max_size:
            return jsonify({
                'success': False, 
                'error': f'Image too large. Maximum size: {max_size}x{max_size} pixels'
            }), 400

        bit_planes = []
        total_energy = 0
        significant_planes = 0

        # Create bit planes
        for bit in range(8):
            bit_plane = (img >> bit) & 1
            bit_plane_image = bit_plane * 255

            energy = np.sum(bit_plane) / (img.shape[0] * img.shape[1])
            total_energy += energy

            if energy > 0.1:
                significant_planes += 1

            bit_planes.append({
                'plane': bit,
                'image': image_to_base64(bit_plane_image),
                'energy': float(energy)
            })

        compression_ratio = 1 - (significant_planes / 8)

        return jsonify({
            'success': True,
            'bit_planes': bit_planes,
            'analysis': {
                'total_planes': 8,
                'significant_planes': significant_planes,
                'compression_ratio': compression_ratio
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/fourier', methods=['POST'])
def fourier_analysis():
    """Fourier transform analysis endpoint"""
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image file provided'}), 400

        file = request.files['image']
        if not file.filename:
            return jsonify({'success': False, 'error': 'Empty file provided'}), 400

        # Read image
        file_bytes = file.read()
        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)

        if img is None:
            return jsonify({'success': False, 'error': 'Invalid image file'}), 400

        # Apply Fourier Transform
        f_transform = np.fft.fft2(img)
        f_shift = np.fft.fftshift(f_transform)

        # Calculate magnitude spectrum
        magnitude = 20 * np.log(np.abs(f_shift) + 1)
        magnitude = np.uint8(255 * magnitude / np.max(magnitude))

        # Calculate phase spectrum
        phase = np.angle(f_shift)
        phase = np.uint8(255 * (phase + np.pi) / (2 * np.pi))

        # Create frequency domain visualization
        freq_domain = np.uint8(255 * np.abs(f_shift) / np.max(np.abs(f_shift)))

        # Analysis
        dominant_freq = np.max(np.abs(f_shift)) / np.sum(np.abs(f_shift))
        energy_concentration = np.sum(magnitude > np.mean(magnitude)) / magnitude.size
        phase_coherence = np.std(phase) / 255

        return jsonify({
            'success': True,
            'magnitude_spectrum': image_to_base64(magnitude),
            'phase_spectrum': image_to_base64(phase),
            'frequency_domain': image_to_base64(freq_domain),
            'analysis': {
                'dominant_frequency': float(dominant_freq),
                'energy_concentration': float(energy_concentration),
                'phase_coherence': float(phase_coherence)
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/sharpening', methods=['POST'])
def image_sharpening():
    """Image sharpening analysis endpoint"""
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image file provided'}), 400

        file = request.files['image']
        if not file.filename:
            return jsonify({'success': False, 'error': 'Empty file provided'}), 400

        # Read image
        file_bytes = file.read()
        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({'success': False, 'error': 'Invalid image file'}), 400

        # Get intensity parameter
        intensity = float(request.form.get('intensity', 50)) / 100.0

        # Create sharpening kernel
        kernel = np.array([[-1,-1,-1],
                          [-1, 9,-1],
                          [-1,-1,-1]]) * intensity

        # Apply sharpening
        sharpened = cv2.filter2D(img, -1, kernel)

        # Calculate metrics
        original_edges = cv2.Laplacian(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), cv2.CV_64F)
        sharpened_edges = cv2.Laplacian(cv2.cvtColor(sharpened, cv2.COLOR_BGR2GRAY), cv2.CV_64F)

        sharpness_increase = (np.mean(np.abs(sharpened_edges)) - np.mean(np.abs(original_edges))) / np.mean(np.abs(original_edges)) * 100
        edge_enhancement = np.sum(np.abs(sharpened_edges) > np.abs(original_edges)) / original_edges.size * 100
        noise_level = np.std(sharpened - img) / 255.0 * 100

        return jsonify({
            'success': True,
            'original': image_to_base64(img),
            'sharpened': image_to_base64(sharpened),
            'metrics': {
                'sharpness_increase': float(sharpness_increase),
                'edge_enhancement': float(edge_enhancement),
                'noise_level': float(noise_level)
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/segmentation', methods=['POST'])
def edge_segmentation():
    """Edge detection and segmentation endpoint"""
    try:
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image file provided'}), 400

        file = request.files['image']
        if not file.filename:
            return jsonify({'success': False, 'error': 'Empty file provided'}), 400

        # Read image
        file_bytes = file.read()
        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({'success': False, 'error': 'Invalid image file'}), 400

        # Process image based on algorithm
        algorithm = request.form.get('algorithm', 'canny')
        threshold = int(request.form.get('threshold', 128))

        # Convert to grayscale for edge detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Apply edge detection
        if algorithm == 'canny':
            edges = cv2.Canny(gray, threshold/2, threshold)
        elif algorithm == 'sobel':
            sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
            sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
            edges = np.uint8(np.sqrt(sobelx**2 + sobely**2))
        else:  # watershed
            edges = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

        # Simple segmentation using threshold
        _, segments = cv2.threshold(gray, threshold, 255, cv2.THRESH_BINARY)

        # Analysis
        edge_count = np.count_nonzero(edges)
        segment_count = len(np.unique(segments))
        avg_segment_size = img.size / segment_count if segment_count > 0 else 0

        return jsonify({
            'success': True,
            'edges': image_to_base64(edges),
            'segments': image_to_base64(segments),
            'analysis': {
                'edge_count': int(edge_count),
                'segment_count': int(segment_count),
                'avg_segment_size': float(avg_segment_size)
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
