// src/components/map/MapContainer.tsx
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Loader from '../common/Loader';
import LocationButton from './LocationButton';
import ZoomControls from './ZoomControls';
import MapLegend from './MapLegend';
import InfoWindow from './InfoWindow';
import StationMarker from './StationMarker';
import MarkerCluster from './MarkerCluster';
import { Station } from '../../types/station';
import { FilterState } from '../../types/filters';
import stationsApi from '../../api/stationsApi';
import { calculateMapCenter, clusterStations } from '../../utils/mapUtils';
import useLocation from '../../hooks/useLocation';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Estonia's boundary coordinates
const ESTONIA_BOUNDS = {
  north: 59.7,  // Northernmost latitude
  south: 57.5,  // Southernmost latitude
  west: 21.8,   // Westernmost longitude
  east: 28.2    // Easternmost longitude
};

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
  filters?: FilterState;
  showControls?: boolean;
  onMarkerClick?: (station: Station) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
  initialCenter = { lat: 58.5953, lng: 25.0136 }, // Estonia's center
  initialZoom = 7,
  filters,
  showControls = true,
  onMarkerClick
}) => {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<StationMarker[]>([]);
  const clustersRef = useRef<MarkerCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const { latitude, longitude, refreshLocation } = useLocation();
  const filtersRef = useRef(filters);
  const stationsDataRef = useRef<Station[]>([]);
  const mapInitializedRef = useRef(false);

  // Update filtersRef when filters prop changes
  useEffect(() => {
    filtersRef.current = filters;
    // Update markers if map is already initialized
    if (mapRef.current && mapInitializedRef.current && stationsDataRef.current.length > 0) {
      updateMarkers();
    }
  }, [filters]);

  // Fetch stations
  const { data: stations = [], isLoading: stationsLoading } = useQuery({
    queryKey: ['stations', filters],
    queryFn: async () => {
      if (filters) {
        return stationsApi.filterStations({
          networkIds: filters.networks,
          connectorTypes: filters.connectorTypes,
          minimumReliability: filters.minimumReliability,
          city: filters.city
        });
      } else {
        return stationsApi.getAllStations();
      }
    }
  });

  // Update stations ref when data changes
  useEffect(() => {
    stationsDataRef.current = stations;
    // Only update markers if map is already initialized
    if (mapRef.current && mapInitializedRef.current) {
      updateMarkers();
    }
  }, [stations]);

  // Handle marker click
  const handleMarkerClick = useCallback((station: Station) => {
    setSelectedStation(station);
    
    // Call external handler if provided
    if (onMarkerClick) {
      onMarkerClick(station);
    }
  }, [onMarkerClick]);

  // Close info window
  const handleInfoWindowClose = useCallback((e: React.MouseEvent) => {
    // Stop event propagation to prevent it from bubbling up to the map
    e.stopPropagation();
    setSelectedStation(null);
  }, []);

  // Go to user's location
  const handleLocationClick = useCallback(() => {
    if (mapRef.current && latitude && longitude) {
      mapRef.current.setCenter({ lat: latitude, lng: longitude });
      mapRef.current.setZoom(15);
    } else {
      refreshLocation();
    }
  }, [latitude, longitude, refreshLocation]);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setZoom((mapRef.current.getZoom() || 0) + 1);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setZoom((mapRef.current.getZoom() || 0) - 1);
    }
  }, []);

  // Update markers function - memoized to prevent unnecessary re-renders
  const updateMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers and clusters
    markersRef.current.forEach(marker => marker.remove());
    clustersRef.current.forEach(cluster => cluster.remove());
    
    // Reset arrays
    markersRef.current = [];
    clustersRef.current = [];
    
    // Filter stations if needed
    let filteredStations = [...stationsDataRef.current];
    const currentFilters = filtersRef.current;
    
    if (currentFilters) {
      if (currentFilters.showOnlyAvailable) {
        filteredStations = filteredStations.filter(station => station.availableConnectors > 0);
      }
    }
    
    // Check if we need to cluster markers (when zoom level is low)
    const zoom = map.getZoom();
    if (zoom && zoom < 10 && filteredStations.length > 10) {
      // Create clusters
      const stationClusters = clusterStations(filteredStations);
      
      stationClusters.forEach(clusterStations => {
        if (clusterStations.length === 1) {
          // Single station, add regular marker
          const station = clusterStations[0];
          const marker = new StationMarker(map, station, () => {
            handleMarkerClick(station);
          });
          markersRef.current.push(marker);
        } else {
          // Multiple stations, add cluster
          const cluster = new MarkerCluster(map, clusterStations, () => {
            // When clicking a cluster, zoom in or show cluster details
            const [lat, lng] = calculateMapCenter(clusterStations);
            map.setCenter({ lat, lng });
            map.setZoom((map.getZoom() || 10) + 2);
          });
          clustersRef.current.push(cluster);
        }
      });
    } else {
      // Add individual markers for each station
      filteredStations.forEach(station => {
        const marker = new StationMarker(map, station, () => {
          handleMarkerClick(station);
        });
        markersRef.current.push(marker);
      });
    }
    
    // Only center map when there's a significant change and no station is selected
    if (filteredStations.length > 0 && !selectedStation) {
      const [lat, lng] = calculateMapCenter(filteredStations);
      map.setCenter({ lat, lng });
    }
  }, [handleMarkerClick, selectedStation]);

  // Initialize Google Maps only once
  useEffect(() => {
    // If map is already initialized, don't initialize again
    if (mapInitializedRef.current) return;

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
            const mapOptions = {
              center: initialCenter,
              zoom: initialZoom,
              restriction: {
                latLngBounds: ESTONIA_BOUNDS,
                strictBounds: true
              },
              fullscreenControl: false,
              mapTypeControl: false,
              streetViewControl: false,
              zoomControl: false,
              styles: [
                {
                  featureType: 'administrative.country',
                  elementType: 'geometry.stroke',
                  stylers: [{ color: '#3c3c3c' }, { weight: 1.5 }]
                }
              ]
            };
            
            const newMap = new window.google.maps.Map(mapContainerRef.current, mapOptions);
            mapRef.current = newMap;
            setLoading(false);
            
            // Add a listener for zoom changes to update markers
            newMap.addListener('zoom_changed', () => {
              updateMarkers();
            });
            
            // Set map as initialized and update markers
            mapInitializedRef.current = true;
            if (stationsDataRef.current.length > 0) {
              updateMarkers();
            }
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
            zoom: initialZoom,
            restriction: {
              latLngBounds: ESTONIA_BOUNDS,
              strictBounds: true
            },
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: false,
            styles: [
              {
                featureType: 'administrative.country',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#3c3c3c' }, { weight: 1.5 }]
              }
            ]
          },
          onInit: (mapInstance) => {
            mapRef.current = mapInstance;
            setLoading(false);
            
            // Add a listener for zoom changes to update markers
            mapInstance.addListener('zoom_changed', () => {
              updateMarkers();
            });
            
            // Set map as initialized and update markers
            mapInitializedRef.current = true;
            if (stationsDataRef.current.length > 0) {
              updateMarkers();
            }
          }
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
      // Clean up markers and clusters
      markersRef.current.forEach(marker => marker.remove());
      clustersRef.current.forEach(cluster => cluster.remove());
      
      // Remove this specific map container from the refs array
      if (mapContainerRef.current) {
        const index = mapInstanceRefs.findIndex(ref => ref.container === mapContainerRef.current);
        if (index !== -1) {
          mapInstanceRefs.splice(index, 1);
        }
      }
    };
  }, [initialCenter.lat, initialCenter.lng, initialZoom, updateMarkers]);

  if (error) {
    return <div className="map-error">{error}</div>;
  }

  return (
    <div className="map-container">
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '100%' }}
        aria-label={t('map.mapOfChargingStations')}
        className="map"
      />
      
      {loading && (
        <div className="map-loader">
          <Loader />
        </div>
      )}
      
      {showControls && mapRef.current && !loading && (
        <>
          <LocationButton
            onClick={handleLocationClick}
            className="map-control map-control--location"
          />
          
          <ZoomControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            className="map-control map-control--zoom"
          />
          
          <MapLegend className="map-control map-control--legend" />
        </>
      )}
      
      {selectedStation && (
        <div 
          className="info-window-container"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            width: '90%',
            maxWidth: '300px'
          }}
          onClick={(e) => e.stopPropagation()} // Prevent map click from closing info window
        >
          <InfoWindow
            station={selectedStation}
            onClose={handleInfoWindowClose}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(MapContainer);