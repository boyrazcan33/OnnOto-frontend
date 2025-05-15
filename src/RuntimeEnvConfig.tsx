import React from 'react';

// Modified runtime environment configuration component
const RuntimeEnvConfig: React.FC = () => {
  // This component injects a runtime config script to handle environment variables
  // that would normally come from process.env
  
  const envConfig = {
    REACT_APP_API_URL: 'https://onnoto-backend-production.up.railway.app/api',
    REACT_APP_DEFAULT_LANGUAGE: 'et'
  };
  
  // Create a script that will set window._env_ for runtime config
  const envScript = `
    window._env_ = ${JSON.stringify(envConfig)};
  `;
  
  // Use dangerouslySetInnerHTML to inject the script
  return (
    <script dangerouslySetInnerHTML={{ __html: envScript }} />
  );
};

export default RuntimeEnvConfig;