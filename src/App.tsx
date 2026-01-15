import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DOZ3Page } from './pages/DOZ3Page';
import { CRMPage } from './pages/CRMPage';
import { PositioningPage } from './pages/PositioningPage';
import { EquipmentGuidePage } from './pages/EquipmentGuidePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/doz3" element={<DOZ3Page />} />
        <Route path="/crm" element={<CRMPage />} />
        <Route path="/positioning" element={<PositioningPage />} />
        <Route path="/equipment" element={<EquipmentGuidePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
