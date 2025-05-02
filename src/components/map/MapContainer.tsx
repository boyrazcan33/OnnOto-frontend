import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useLocation from '../../hooks/useLocation';
import useStations from '../../hooks/useStations';
import { Station } from '../../types/station';
import { calculateMapCenter, calculateZoomLevel, clusterStations } from '../../utils/mapUtils';
import { FilterState } from '../../types/filters';
import StationMarker from './StationMarker';
import MarkerCluster from './MarkerCluster';
import MapLegend from './MapLegend';
import LocationButton from './LocationButton';
import ZoomControls from './ZoomControls';
import Loader from '../common/Loader';

// Import Google Maps types but use with type assertion
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface MapContainerProps {
  filters?: FilterState;
  onMarkerClick?: (station: Station) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
  showControls?: boolean;
}

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
  const markersRef = useRef<google.maps.Marker[]>([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const { latitude, longitude, loading: locationLoading } = useLocation();
  const { stations, loading: stationsLoading, error } = useStations();

  // Filter stations based on provided filters
  const filteredStations = React.useMemo(() => {
    if (!filters) return stations;

    return stations.filter(station => {
      // Filter by network
      if (filters.networks.length > 0 && !filters.networks.includes(station.networkId || '')) {
        return false;
      }

      // Filter by connector types (would need connector data here)
      
      // Filter by minimum reliability
      if (station.reliabilityScore < filters.minimumReliability) {
        return false;
      }

      // Filter by city
      if (filters.city && station.city !== filters.city) {
        return false;
      }

      // Filter by availability
      if (filters.showOnlyAvailable && station.availableConnectors === 0) {
        return false;
      }

      // Filter by favorites
      if (filters.showOnlyFavorites && !isFavorite(station.id)) {
        return false;
      }

      return true;
    });
  }, [stations, filters]);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded && mapContainerRef.current) {
      const loadGoogleMaps = () => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        window.initMap = () => {
          if (mapContainerRef.current) {
            const center = initialCenter || [latitude, longitude];
            
            mapInstanceRef.current = new window.google.maps.Map(mapContainerRef.current, {
              center: { lat: center[0], lng: center[1] },
              zoom: initialZoom,
              disableDefaultUI: true,
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false
            });

            setMapLoaded(true);
          }
        };
      };

      loadGoogleMaps();
    }
  }, [mapLoaded, initialCenter, initialZoom, latitude, longitude]);

  // Update map when stations or filters change
  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current && filteredStations.length > 0) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
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
          // Single station marker
          const station = cluster[0];
          const marker = new StationMarker(
            mapInstanceRef.current!,
            station,
            () => {
              setSelectedStation(station);
              if (onMarkerClick) onMarkerClick(station);
            }
          ).getMarker();
          
          markersRef.current.push(marker);
        } else {
          // Cluster marker
          const marker = new MarkerCluster(
            mapInstanceRef.current!,
            cluster,
            () => {
              // Zoom in on cluster
              const bounds = new window.google.maps.LatLngBounds();
              cluster.forEach(station => {
                bounds.extend({
                  lat: Number(station.latitude),
                  lng: Number(station.longitude)
                });
              });
              mapInstanceRef.current!.fitBounds(bounds);
              mapInstanceRef.current!.setZoom(Math.min(15, mapInstanceRef.current!.getZoom() + 1));
            }
          ).getMarker();
          
          markersRef.current.push(marker);
        }
      });
    }
  }, [mapLoaded, filteredStations, initialCenter, onMarkerClick]);

  // Center map on current location
  const centerOnLocation = () => {
    if (mapLoaded && mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: latitude, lng: longitude });
      mapInstanceRef.current.setZoom(14);
    }
  };

  // Zoom controls
  const zoomIn = () => {
    if (mapLoaded && mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
    }
  };

  const zoomOut = () => {
    if (mapLoaded && mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
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
            onZoomIn={zoomIn} 
            onZoomOut={zoomOut} 
            className="map-control map-control--zoom"
          />
          <MapLegend className="map-control map-control--legend" />
        </>
      )}
    </div>
  );
};

export default MapContainer;