import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import MainLayout from './components/Layout/MainLayout';

// Pages
import LoginPage from './pages/LoginPage';
import PatientDashboard from './pages/patient/Dashboard';
import DoctorDashboard from './pages/doctor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import MedicalRecordsPage from './pages/medical-records/MedicalRecordsPage';
import AppointmentsPage from './pages/appointments/AppointmentsPage';

// Protected Route Component
import ProtectedRoute from './routes/ProtectedRoute';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard routes based on role */}
            <Route path="dashboard" element={<RoleBasedDashboard />} />
            
            {/* Common routes */}
            <Route path="medical-records" element={<MedicalRecordsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            
            {/* Fallback for undefined routes */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);

// Role-based dashboard renderer
function RoleBasedDashboard() {
  const userRole = JSON.parse(localStorage.getItem('healthcareUser') || '{}')?.role;
  
  switch (userRole) {
    case 'patient':
      return <PatientDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
}