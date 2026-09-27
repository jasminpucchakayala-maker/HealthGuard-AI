import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HealthProvider } from './context/HealthContext';

// Pages
import { AuthPage } from './pages/AuthPage';
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { MedicinesPage } from './pages/patient/MedicinesPage';
import { VoiceAssistantPage } from './pages/patient/VoiceAssistantPage';
import { CaregiverConnectPage } from './pages/patient/CaregiverConnectPage';
import { ProfilePage } from './pages/patient/ProfilePage';
import { EmergencyInfoPage } from './pages/patient/EmergencyInfoPage';
import { AIChatPage } from './pages/patient/AIChatPage';

import { CaregiverDashboard } from './pages/caregiver/CaregiverDashboard';
import { PatientsPage } from './pages/caregiver/PatientsPage';
import { AlertsPage } from './pages/caregiver/AlertsPage';
import { MessagesPage } from './pages/caregiver/MessagesPage';
import { AnalyticsPage } from './pages/caregiver/AnalyticsPage';

import { SettingsPage } from './pages/common/SettingsPage';
import { PrivacyPage } from './pages/common/PrivacyPage';
import { TermsPage } from './pages/common/TermsPage';

import { DemoPanel } from './components/demo/DemoPanel';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Patient Routes */}
      <Route
        path="/patient"
        element={userRole === 'patient' ? <PatientDashboard /> : <Navigate to="/caregiver" replace />}
      />
      <Route
        path="/patient/medicines"
        element={userRole === 'patient' ? <MedicinesPage /> : <Navigate to="/caregiver" replace />}
      />
      <Route
        path="/patient/assistant"
        element={userRole === 'patient' ? <VoiceAssistantPage /> : <Navigate to="/caregiver" replace />}
      />
      <Route
        path="/patient/caregiver"
        element={userRole === 'patient' ? <CaregiverConnectPage /> : <Navigate to="/caregiver" replace />}
      />
      <Route
        path="/patient/profile"
        element={userRole === 'patient' ? <ProfilePage /> : <Navigate to="/caregiver" replace />}
      />
      <Route
        path="/patient/emergency-info"
        element={userRole === 'patient' ? <EmergencyInfoPage /> : <Navigate to="/caregiver" replace />}
      />
      <Route
        path="/patient/chat"
        element={userRole === 'patient' ? <AIChatPage /> : <Navigate to="/caregiver" replace />}
      />

      {/* Caregiver Routes */}
      <Route
        path="/caregiver"
        element={userRole === 'caregiver' ? <CaregiverDashboard /> : <Navigate to="/patient" replace />}
      />
      <Route
        path="/caregiver/patients"
        element={userRole === 'caregiver' ? <PatientsPage /> : <Navigate to="/patient" replace />}
      />
      <Route
        path="/caregiver/alerts"
        element={userRole === 'caregiver' ? <AlertsPage /> : <Navigate to="/patient" replace />}
      />
      <Route
        path="/caregiver/messages"
        element={userRole === 'caregiver' ? <MessagesPage /> : <Navigate to="/patient" replace />}
      />
      <Route
        path="/caregiver/analytics"
        element={userRole === 'caregiver' ? <AnalyticsPage /> : <Navigate to="/patient" replace />}
      />

      {/* Common Settings & Legal Routes */}
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      {/* Default Catch-all Redirect */}
      <Route
        path="*"
        element={<Navigate to={userRole === 'caregiver' ? '/caregiver' : '/patient'} replace />}
      />
    </Routes>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <HealthProvider>
            <Router basename={import.meta.env.BASE_URL}>
              <AppRoutes />
              <DemoPanel />
            </Router>
          </HealthProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
