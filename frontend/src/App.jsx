import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import Events from './pages/Events';
import News from './pages/News';
import Work from './pages/Work';
import OurJourney from './pages/OurJourney';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import TeamManagement from './pages/admin/TeamManagement';
import EventsManagement from './pages/admin/EventsManagement';
import NewsManagement from './pages/admin/NewsManagement';
import FormsManagement from './pages/admin/FormsManagement';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Routes Component (with Navbar)
const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/team" element={<Team />} />
      <Route path="/events" element={<Events />} />
      <Route path="/news" element={<News />} />
      <Route path="/work" element={<Work />} />
      <Route path="/our-journey" element={<OurJourney />} />
      <Route path="/login" element={<Login />} />
      
      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/team"
        element={
          <ProtectedRoute>
            <TeamManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute>
            <EventsManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/news"
        element={
          <ProtectedRoute>
            <NewsManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/news"
        element={
          <ProtectedRoute>
            <NewsManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/forms"
        element={
          <ProtectedRoute>
            <FormsManagement />
          </ProtectedRoute>
        }
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <div>
        <PublicRoutes />
      </div>
    </AuthProvider>
  );
};

export default App;