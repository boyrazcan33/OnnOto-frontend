// src/components/map/MapContainer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useLocation from '../../hooks/useLocation';
import useStations from '../../hooks/useStations';
import { Station } from '../../types/station';
import { FilterState } from '../../types/filters';
import { calculateMapCenter, calculateZoomLevel, clusterStations, getMarkerIcon } from '../../utils/mapUtils';
import StationMarker from './StationMarker';
import MarkerCluster from './MarkerCluster';
import MapLegend from './MapLegend';
import LocationButton from './LocationButton';
import ZoomControls from './ZoomControls';
import Loader from '../common/Loader';
import InfoWindow from './InfoWindow';

// Define a MarkerInterface to use instead of google.maps.Marker directly
interface MarkerInterface {
  setMap(map: google.maps.Map | null): void;
  setIcon?(icon: any): void;
  get(key: string): any;
  set(key: string, value: any): void;
}

interface MapContainerProps {
  filters?: FilterState;
  onMarkerClick?: (station: Station) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
  showControls?: boolean;
}

// Mock websocket updates for development
const useMockWebSocket = (
  enabled: boolean = process.env.NODE_ENV === 'development',
  interval: number = 5000
): { updates: any[] } => {
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    if (!enabled) return;

    // Simulate WebSocket updates
    const timer = setInterval(() => {
      const update = {
        stationId: `station-${Math.floor(Math.random() * 2) + 1}`,
        status: ['AVAILABLE', 'OCCUPIED', 'OFFLINE'][Math.floor(Math.random() * 3)]
      };
      setUpdates(prev => [...prev, update]);
    }, interval);

    return () => clearInterval(timer);
  }, [enabled, interval]);

  return { updates };
};

const MapContainer: React.FC<MapContainerProps> = ({
  filters,
  onMarkerClick,
  initialCenter,
  initialZoom = 8,
  showControls = true
}) => {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<MarkerInterface[]>([]);
  const googleMapsLoadedRef = useRef<boolean>(false);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const { latitude, longitude, loading: locationLoading } = useLocation();
  const { stations, loading: stationsLoading, error, isFavorite } = useStations();

  // Use mock WebSocket in development
  const { updates } = useMockWebSocket();

  // Process WebSocket updates
  useEffect(() => {
    if (updates.length > 0) {
      const latestUpdate = updates[updates.length - 1];
      handleStationUpdate(latestUpdate);
    }
  }, [updates]);

  // Try to establish real WebSocket connection in production
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws';
      try {
        const ws = new WebSocket(wsUrl);
        
        ws.onmessage = (event) => {
          try {
            const update = JSON.parse(event.data);
            handleStationUpdate(update);
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };

        ws.onerror = (event) => {
          console.warn('WebSocket connection error - falling back to polling');
        };

        return () => {
          ws.close();
        };
      } catch (err) {
        console.warn('Failed to initialize WebSocket - falling back to polling');
      }
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded && mapContainerRef.current) {
      // Define map initialization function
      const initMap = () => {
        if (!mapContainerRef.current) return;
        
        try {
          const center = initialCenter || [latitude || 58.5953, longitude || 25.0136];
          
          mapInstanceRef.current = new window.google.maps.Map(mapContainerRef.current, {
            center: { lat: center[0], lng: center[1] },
            zoom: initialZoom,
            disableDefaultUI: true,
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          setMapLoaded(true);
          googleMapsLoadedRef.current = true;
        } catch (error) {
          console.error("Error initializing map:", error);
          // Retry initialization after a delay
          setTimeout(initMap, 500);
        }
      };

      // Load Google Maps if not already loaded
      const loadGoogleMaps = () => {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          initMap();
          return;
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
        if (existingScript) {
          // If already loading, set up our init function to be called after load
          const callbackName = 'initMap';
          const originalInitMap = window[callbackName];
          
          // Create a new initialization function that calls both the original and our init
          window[callbackName] = () => {
            if (typeof originalInitMap === 'function') {
              originalInitMap();
            }
            initMap();
          };
          return;
        }

        // Set the global initialization function
        window.initMap = initMap;

        // Load the Google Maps script with async
        const script = document.createElement('script');
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&loading=async`;
        script.async = true;
        script.defer = true;
        
        // Add error handling for script loading
        script.onerror = () => {
          console.error('Failed to load Google Maps API');
        };
        
        document.head.appendChild(script);
      };

      loadGoogleMaps();
    }
  }, [mapLoaded, initialCenter, initialZoom, latitude, longitude]);

  // Filter stations
  const filteredStations = React.useMemo(() => {
    if (!filters) return stations;

    return stations.filter(station => {
      if (filters.networks.length > 0 && !filters.networks.includes(station.networkId || '')) {
        return false;
      }
      if (station.reliabilityScore < filters.minimumReliability) {
        return false;
      }
      if (filters.city && station.city !== filters.city) {
        return false;
      }
      if (filters.showOnlyAvailable && station.availableConnectors === 0) {
        return false;
      }
      if (filters.showOnlyFavorites && !isFavorite(station.id)) {
        return false;
      }
      if (filters.connectorTypes.length > 0) {
        const hasMatchingConnector = station.connectors && station.connectors.some(
          connector => filters.connectorTypes.includes(connector.type)
        );
        if (!hasMatchingConnector) return false;
      }
      return true;
    });
  }, [stations, filters, isFavorite]);

  // Update markers
  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current && filteredStations.length > 0) {
      // Clear existing markers
      markersRef.current.forEach(marker => {
        if (typeof marker.setMap === 'function') {
          marker.setMap(null);
        }
      });
      markersRef.current = [];

      // Calculate map center and zoom if not provided
      if (!initialCenter) {
        const center = calculateMapCenter(filteredStations);
        const zoom = calculateZoomLevel(filteredStations);
        
        mapInstanceRef.current.setCenter({ lat: center[0], lng: center[1] });
        mapInstanceRef.current.setZoom(zoom);
      }

      // Add markers for stations
      const clusters = clusterStations(filteredStations);
      
      clusters.forEach(cluster => {
        if (cluster.length === 1) {
          const station = cluster[0];
          const markerInterface = new StationMarker(
            mapInstanceRef.current!,
            station,
            () => {
              setSelectedStation(station);
              if (onMarkerClick) onMarkerClick(station);
            }
          ).getMarker();
          
          markersRef.current.push(markerInterface);
        } else {
          const markerInterface = new MarkerCluster(
            mapInstanceRef.current!,
            cluster,
            () => {
              const bounds = new window.google.maps.LatLngBounds();
              cluster.forEach(station => {
                bounds.extend({
                  lat: Number(station.latitude),
                  lng: Number(station.longitude)
                });
              });
              mapInstanceRef.current?.fitBounds(bounds);
              const currentZoom = mapInstanceRef.current?.getZoom() || 0;
              mapInstanceRef.current?.setZoom(Math.min(15, currentZoom + 1));
            }
          ).getMarker();
          
          markersRef.current.push(markerInterface);
        }
      });
    }
  }, [mapLoaded, filteredStations, initialCenter, onMarkerClick]);

  const handleStationUpdate = (update: any) => {
    const marker = markersRef.current.find(
      m => m.get && m.get('stationId') === update.stationId
    );
    if (marker && typeof marker.setIcon === 'function') {
      marker.setIcon(getMarkerIcon(update.status));
    }
  };

  const centerOnLocation = () => {
    if (mapLoaded && mapInstanceRef.current && latitude && longitude) {
      mapInstanceRef.current.setCenter({ lat: latitude, lng: longitude });
      mapInstanceRef.current.setZoom(14);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (mapLoaded && mapInstanceRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom() || 0;
      mapInstanceRef.current.setZoom(currentZoom + (direction === 'in' ? 1 : -1));
    }
  };

  if (error) {
    return (
      <div className="map-error">
        <p>{t('map.errorLoading')}</p>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div 
        ref={mapContainerRef} 
        className="map"
        aria-label={t('map.mapOfChargingStations')}
      />
      
      {(stationsLoading || locationLoading) && (
        <div className="map-loader">
          <Loader />
        </div>
      )}
      
      {mapLoaded && showControls && (
        <>
          <LocationButton 
            onClick={centerOnLocation} 
            className="map-control map-control--location"
          />
          <ZoomControls 
            onZoomIn={() => handleZoom('in')} 
            onZoomOut={() => handleZoom('out')} 
            className="map-control map-control--zoom"
          />
          <MapLegend className="map-control map-control--legend" />
        </>
      )}

      {selectedStation && (
        <div className="map-page__info-window">
          <InfoWindow
            station={selectedStation}
            onClose={() => setSelectedStation(null)}
          />
        </div>
      )}
    </div>
  );
};

export default MapContainer;