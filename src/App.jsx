import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index.jsx";
import NotFound from "./pages/NotFound.jsx";

// Import all components
import BitPlaneViewer from "./components/BitPlaneViewer";
import FourierExplorer from "./components/FourierExplorer";
import EdgeSegmentation from "./components/EdgeSegmentation";
import SharpeningPanel from "./components/SharpeningPanel";
import MalwareStaticAnalysis from "./components/MalwareStaticAnalysis";
import IntrusionDetectionConsole from "./components/IntrusionDetectionConsole";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}>
            <Route index element={<Navigate to="/bit-planes" replace />} />
            <Route path="bit-planes" element={<BitPlaneViewer />} />
            <Route path="fourier" element={<FourierExplorer />} />
            <Route path="edge-segmentation" element={<EdgeSegmentation />} />
            <Route path="sharpening" element={<SharpeningPanel />} />
            <Route path="malware-analysis" element={<MalwareStaticAnalysis />} />
            <Route path="intrusion-detection" element={<IntrusionDetectionConsole />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
