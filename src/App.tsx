import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DOZ3Page } from './pages/DOZ3Page';
import { CRMPage } from './pages/CRMPage';
import { PositioningPage } from './pages/PositioningPage';
import { pb } from './lib/pocketbase';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = pb.authStore.isValid;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/doz3" element={<DOZ3Page />} />
        <Route
          path="/crm"
          element={
            <ProtectedRoute>
              <CRMPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/positioning"
          element={
            <ProtectedRoute>
              <PositioningPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
