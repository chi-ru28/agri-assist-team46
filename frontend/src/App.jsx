import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ChatPage } from './pages/ChatPage';
import { Profile } from './pages/Profile';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { InventoryManager } from './pages/InventoryManager';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

const App = () => {
  return (
    <div className="font-sans antialiased text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/:role/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* Optional placeholders */}
            <Route
              path="/farmer/dashboard"
              element={
                <ProtectedRoute>
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shopkeeper/dashboard"
              element={
                <ProtectedRoute>
                  <InventoryManager />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
