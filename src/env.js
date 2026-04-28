// Create a simple env.js file in your src directory

// src/env.js
export const API_URL = window._env_?.REACT_APP_API_URL || 'https://onnoto-backend-54951354342.europe-north1.run.app/api';
export const DEFAULT_LANGUAGE = window._env_?.REACT_APP_DEFAULT_LANGUAGE || 'et';
export const GOOGLE_MAPS_API_KEY = window._env_?.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyDNaSsztwCvUUa21VaxIT1eiOvjbhoTh24';
export const MAP_ID = window._env_?.REACT_APP_MAP_ID || '39e802ee171e1fa352134f35';
export const WS_URL = window._env_?.REACT_APP_WS_URL || 'wss://onnoto-backend-54951354342.europe-north1.run.app/ws';

// Then in your LanguageContext.tsx, replace:
// const DEFAULT_LANGUAGE = process.env.REACT_APP_DEFAULT_LANGUAGE || 'et';
// with:
import { DEFAULT_LANGUAGE } from '../env';

// In your apiEndpoints.ts, replace:
// const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
// with:
import { API_URL } from '../env';
const API_BASE_URL = API_URL;