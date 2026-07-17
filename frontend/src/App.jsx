import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Login.jsx'; // Imports your new Login component
import Dashboard from './features/dashboard/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import QueryDetails from './features/queries/queryDetails.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/queries/:id" element={
          <ProtectedRoute>
            <QueryDetails />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;