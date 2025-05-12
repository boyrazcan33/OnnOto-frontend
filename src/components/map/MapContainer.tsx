// src/components/map/MapContainer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '../common/Loader';

// Replace with your actual API key
// This key should be placed in your .env file as REACT_APP_GOOGLE_MAPS_API_KEY
const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Single global function to initialize maps
// We'll use this to trigger all maps to initialize once the script is loaded
const GLOBAL_CALLBACK_NAME = 'initAllGoogleMaps';
const mapInstanceRefs: Array<{
  container: HTMLDivElement;
  options: google.maps.MapOptions;
  onInit?: (map: google.maps.Map) => void;
}> = [];

// Flag to track if we've already started loading Google Maps
let googleMapsLoading = false;

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
    // Define global init function if it doesn't exist
    if (!(window as any)[GLOBAL_CALLBACK_NAME]) {
      (window as any)[GLOBAL_CALLBACK_NAME] = function() {
        // Initialize all registered map instances
        mapInstanceRefs.forEach(({ container, options, onInit }) => {
          try {
            if (container) {
              const map = new window.google.maps.Map(container, options);
              if (onInit) onInit(map);
            }
          } catch (e) {
            console.error('Error initializing map:', e);
          }
        });
      };
    }
    
    const loadGoogleMaps = () => {
      // If Google Maps is already loaded
      if (window.google && window.google.maps) {
        if (mapContainerRef.current) {
          try {
            const map = new window.google.maps.Map(mapContainerRef.current, {
              center: initialCenter,
              zoom: initialZoom
            });
            setLoading(false);
          } catch (e) {
            setError('Failed to initialize Google Maps');
            setLoading(false);
            console.error('Google Maps error:', e);
          }
        }
        return;
      }
      
      // Register this map instance
      if (mapContainerRef.current) {
        mapInstanceRefs.push({
          container: mapContainerRef.current,
          options: {
            center: initialCenter,
            zoom: initialZoom
          },
          onInit: () => setLoading(false)
        });
      }
      
      // If we're already loading Google Maps, don't add another script
      if (googleMapsLoading) return;
      
      // Start loading Google Maps
      googleMapsLoading = true;
      
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=${GLOBAL_CALLBACK_NAME}`;
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        setError('Failed to load Google Maps API');
        setLoading(false);
        googleMapsLoading = false;
      };
      
      document.head.appendChild(script);
    };
    
    loadGoogleMaps();
    
    // Clean up
    return () => {
      // Remove this specific map container from the refs array
      if (mapContainerRef.current) {
        const index = mapInstanceRefs.findIndex(ref => ref.container === mapContainerRef.current);
        if (index !== -1) {
          mapInstanceRefs.splice(index, 1);
        }
      }
    };
  }, [initialCenter, initialZoom]);
  
  if (error) {
    return <div className="map-error">{error}</div>;
  }
  
  return (
    <div className="map-container">
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '100%' }}
        aria-label={t('map.mapOfChargingStations')}
      />
      
      {loading && (
        <div className="map-loader">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default MapContainer;