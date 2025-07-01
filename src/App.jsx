import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/auth/Login'
import Dashboard from './components/dashboard/Dashboard'
import PatientManagement from './components/admin/PatientManagement'
import AppointmentManagement from './components/admin/AppointmentManagement'
import Calendar from './components/admin/Calendar'
import PatientView from './components/patient/PatientView'
import './App.css'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  // If the user is a patient and tries to access any route except /patient-view, redirect them
  if (user?.role === 'Patient' && window.location.pathname !== '/patient-view') {
    return <Navigate to="/patient-view" replace />
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // If the user is not allowed, redirect based on role
    if (user?.role === 'Patient') {
      return <Navigate to="/patient-view" replace />
    }
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/patients" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <PatientManagement />
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AppointmentManagement />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Calendar />
              </ProtectedRoute>
            } />
            <Route path="/patient-view" element={
              <ProtectedRoute allowedRoles={['Patient']}>
                <PatientView />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
