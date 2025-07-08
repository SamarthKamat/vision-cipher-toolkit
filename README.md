
# SecureVision - Image Analysis & Security Toolkit

A comprehensive full-stack web application for advanced image analysis and security monitoring, featuring six specialized modules for forensic analysis, threat detection, and malware assessment.

## 🛡️ Features

### Frontend Modules
- **Bit-Plane Viewer**: Decompose images into individual bit planes for forensic analysis
- **Fourier Explorer**: Analyze frequency domain characteristics and spectral properties
- **Sharpening Panel**: Enhance image details with advanced filtering algorithms
- **Edge Segmentation**: Detect edges and segment images using multiple algorithms
- **Intrusion Detection Console**: Real-time network monitoring and threat detection
- **Malware Static Analysis**: Comprehensive analysis of executable files for threats

### Design Features
- 🎨 Modern cybersecurity-themed dark UI with electric blue accents
- 📱 Fully responsive design with collapsible sidebar navigation
- ✨ Smooth animations and micro-interactions throughout
- ♿ Accessibility-first design with ARIA labels and keyboard navigation
- 🔄 Real-time data visualization with animated charts and progress bars

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ for backend services

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

## 🏗️ Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── BitPlaneViewer.jsx
│   │   │   ├── FourierExplorer.jsx
│   │   │   ├── SharpeningPanel.jsx
│   │   │   ├── EdgeSegmentation.jsx
│   │   │   ├── IntrusionDetectionConsole.jsx
│   │   │   ├── MalwareStaticAnalysis.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/               # Page components
│   │   └── styles/              # CSS modules and global styles
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app.py                   # Flask application
│   ├── requirements.txt         # Python dependencies
│   └── README.md
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **JavaScript/JSX** - Pure JavaScript implementation (no TypeScript)
- **CSS Modules** - Component-scoped styling
- **Lucide React** - Beautiful icon library
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching

### Backend
- **Flask** - Lightweight Python web framework
- **Flask-CORS** - Cross-origin resource sharing support
- **NumPy** - Numerical computing for image processing
- **OpenCV** - Computer vision and image processing
- **Matplotlib** - Data visualization and plotting
- **Pillow** - Python image processing library

## 🎯 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/bitplanes` | POST | Bit-plane decomposition analysis |
| `/api/fourier` | POST | Fourier transform analysis |
| `/api/sharpening` | POST | Image sharpening processing |
| `/api/segmentation` | POST | Edge detection and segmentation |
| `/api/intrusion` | GET | Intrusion detection system data |
| `/api/malware` | POST | Malware static analysis |

## 🎨 Design System

### Color Palette
- **Primary**: Electric Blue (#00d4ff)
- **Secondary**: Cyan (#00ffff)
- **Success**: Green (#00ff88)
- **Warning**: Orange (#ffa502)
- **Error**: Red (#ff4757)
- **Background**: Dark (#0a0a0a, #1a1a1a)

### Typography
- **Font Family**: Inter, system fonts
- **Headings**: 700 weight, gradient text effects
- **Body**: 400-500 weight, optimized line height

## 🔒 Security Features

- **Real-time Threat Monitoring**: Live intrusion detection with severity classification
- **File Analysis**: Static malware analysis with threat scoring
- **Secure Communication**: CORS-enabled API with proper headers
- **Error Handling**: Comprehensive error states and user feedback

## 🚦 Development

### Running Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend && python -m pytest
```

### Code Quality
- ESLint configuration for JavaScript best practices
- Prettier for consistent code formatting
- CSS validation and optimization

## 📱 Responsive Design

- **Desktop**: Full sidebar with expanded navigation
- **Tablet**: Collapsible sidebar with touch-optimized controls
- **Mobile**: Mobile-first responsive design with optimized layouts

## ♿ Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management and ARIA labels

## 🔄 Performance

- Lazy loading for large datasets
- Optimized image processing
- Efficient state management
- Minimal bundle size with tree shaking

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

Built with ❤️ for cybersecurity professionals and image analysis researchers.
