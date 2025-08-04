import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateAccount from './pages/CreateAccount/CreateAccount'
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import { AuthProvider } from './auth/AuthProvider';
import PrivateRoutes from './components/PrivateRoutes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  ) 
}

export default App
