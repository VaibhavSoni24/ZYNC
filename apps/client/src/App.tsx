import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SmokeShaderBackground } from './components/Background/SmokeShaderBackground';
import { Floating3DShapes } from './components/Background/Floating3DShapes';
import { PageTransition } from './components/Navigation/PageTransition';

// Feature Pages
import { LandingPage } from './features/landing/LandingPage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { VerifyOtpPage } from './features/auth/VerifyOtpPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { HomePage } from './features/home/HomePage';
import { HostRoomPage } from './features/room/HostRoomPage';
import { JoinRoomPage } from './features/room/JoinRoomPage';
import { RoomPage } from './features/room/RoomPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { DeleteAccountPage } from './features/profile/DeleteAccountPage';
import { AboutPage } from './features/about/AboutPage';
import { ContactPage } from './features/contact/ContactPage';
import { NotFoundPage } from './features/notFound/NotFoundPage';

interface RouteGuardProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicOnlyRoute: React.FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-transparent text-text-primary relative selection:bg-accent-blue/30 selection:text-white">
        {/* Global 60FPS WebGL Smoke Shader Background for ALL pages */}
        <SmokeShaderBackground />
        {/* Global 3D Snowfall & Tumbling Glass Shapes for ALL pages */}
        <Floating3DShapes />

        <Navbar />
        <main className="flex-1 relative z-20">
          <PageTransition>
            <Routes>
              {/* Public Only Guest Routes (redirect to /home if already logged in) */}
              <Route
                path="/"
                element={
                  <PublicOnlyRoute>
                    <LandingPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicOnlyRoute>
                    <ForgotPasswordPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicOnlyRoute>
                    <RegisterPage />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/verify-otp"
                element={
                  <PublicOnlyRoute>
                    <VerifyOtpPage />
                  </PublicOnlyRoute>
                }
              />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/room/host"
              element={
                <ProtectedRoute>
                  <HostRoomPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delete-account"
              element={
                <ProtectedRoute>
                  <DeleteAccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/delete_account"
              element={
                <ProtectedRoute>
                  <DeleteAccountPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Room & User Routes */}
            <Route
              path="/room/join"
              element={
                <ProtectedRoute>
                  <JoinRoomPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/room/:code"
              element={
                <ProtectedRoute>
                  <RoomPage />
                </ProtectedRoute>
              }
            />

            {/* General Routes */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* 404 Custom Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
      </div>
    </BrowserRouter>
  );
};
