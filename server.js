const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();

// Inject runtime environment variables into the app
app.use((req, res, next) => {
  if (req.path === '/env-config.js') {
    res.set('Content-Type', 'application/javascript');
    
    // Create a runtime configuration object with environment variables
    // that need to be accessible in the client-side code
    const envConfig = `
      window._env_ = {
        REACT_APP_API_URL: "${process.env.REACT_APP_API_URL || 'https://onnoto-backend.fly.dev/api'}",
        REACT_APP_DEFAULT_LANGUAGE: "${process.env.REACT_APP_DEFAULT_LANGUAGE || 'et'}",
        REACT_APP_GOOGLE_MAPS_API_KEY: "${process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}",
        REACT_APP_MAP_ID: "${process.env.REACT_APP_MAP_ID || ''}",
        REACT_APP_WS_URL: "${process.env.REACT_APP_WS_URL || 'wss://onnoto-backend.fly.dev/ws'}"
      };
    `;
    
    return res.send(envConfig);
  }
  next();
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// For API requests, optionally proxy to your backend
// Uncomment if you want to proxy API requests through this server
/*
const { createProxyMiddleware } = require('http-proxy-middleware');
const apiProxy = createProxyMiddleware('/api', {
  target: process.env.REACT_APP_API_URL || 'https://onnoto-backend-production.up.railway.app',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // rewrite path
  },
});
app.use('/api', apiProxy);
*/

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`API URL: ${process.env.REACT_APP_API_URL || 'https://onnoto-backend.fly.dev/api'}`);
});