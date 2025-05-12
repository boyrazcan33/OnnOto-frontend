// src/components/map/MapContainer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '../common/Loader';

// Replace with your actual API key
// This key should be placed in your .env file as REACT_APP_GOOGLE_MAPS_API_KEY
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

interface MapContainerProps {
  initialCenter?: { lat: number, lng: number };
  initialZoom?: number;
}

const MapContainer: React.FC<MapContainerProps> = ({
  initialCenter = { lat: 58.5953, lng: 25.0136 }, // Estonia's center
  initialZoom = 8
}) => {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const script = document.createElement('script');
    const scriptId = 'google-maps-script';
    
    // If the script is already added, don't add it again
    if (document.getElementById(scriptId)) {
      return;
    }
    
    // Create a simple callback function
    (window as any).initMap = function() {
      if (!mapContainerRef.current) return;
      
      try {
        new window.google.maps.Map(mapContainerRef.current, {
          center: initialCenter,
          zoom: initialZoom,
        });
        setLoading(false);
      } catch (e) {
        setError('Failed to initialize Google Maps');
        setLoading(false);
        console.error('Google Maps error:', e);
      }
    };
    
    // Set up the script
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setError('Failed to load Google Maps API');
      setLoading(false);
    };
    
    // Add the script to the document
    document.head.appendChild(script);
    
    // Cleanup
    return () => {
      // Use type assertion to avoid TypeScript errors
      (window as any).initMap = undefined;
    };
  }, [initialCenter, initialZoom]);
  
  if (error) {
    return <div className="map-error">{error}</div>;
  }
  
  return (
    <div className="map-container">
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '500px' }}
        aria-label={t('map.mapOfChargingStations')}
      />
      
      {loading && (
        <div className="map-loader" style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)'
        }}>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default MapContainer;