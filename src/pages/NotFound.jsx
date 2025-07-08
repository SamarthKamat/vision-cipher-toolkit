
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 max-w-md">
        <div className="mb-6">
          <AlertTriangle size={64} className="mx-auto text-red-400 mb-4" />
          <h1 className="text-6xl font-bold mb-2 text-white">404</h1>
          <p className="text-xl text-gray-300 mb-4">Security Module Not Found</p>
          <p className="text-gray-400 mb-6">
            The requested security analysis module could not be located in the system.
          </p>
        </div>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
        >
          <Home size={20} />
          Return to Security Console
        </a>
      </div>
    </div>
  );
};

export default NotFound;
