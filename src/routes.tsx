import React from 'react';
import LandingPage from './pages/LandingPage';
import MapPage from './pages/MapPage';
import StationDetailsPage from './pages/StationDetailsPage';
import ReliabilityDashboardPage from './pages/ReliabilityDashboardPage';
import ReportPage from './pages/ReportPage';

// Use placeholder components until they're implemented in later steps
const PlaceholderPage: React.FC<{ title: string; fullHeight?: boolean }> = ({ title, fullHeight = false }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: fullHeight ? '100vh' : '80vh',
      fontSize: '24px',
    }}
  >
    {title} Page - Coming Soon
  </div>
);

const routes = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/map',
    element: <MapPage />,
  },
  {
    path: '/station/:id',
    element: <StationDetailsPage />,
  },
  {
    path: '/report/:id',
    element: <ReportPage />,
  },
  {
    path: '/settings',
    element: <PlaceholderPage title="Settings" />,
  },
  {
    path: '/reliability',
    element: <ReliabilityDashboardPage />,
  },
  {
    path: '/onboarding',
    element: <PlaceholderPage title="Onboarding" fullHeight={true} />,
  },
  {
    path: '/offline',
    element: <PlaceholderPage title="Offline" />,
  },
];

export default routes;