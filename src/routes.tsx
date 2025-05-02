import React from 'react';
import LandingPage from './pages/LandingPage';
import MapPage from './pages/MapPage';

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
    element: <PlaceholderPage title="Station Details" />,
  },
  {
    path: '/report/:id',
    element: <PlaceholderPage title="Report" />,
  },
  {
    path: '/settings',
    element: <PlaceholderPage title="Settings" />,
  },
  {
    path: '/reliability',
    element: <PlaceholderPage title="Reliability Dashboard" />,
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