// src/components/map/StationMarker.tsx
import { Station } from '../../types/station';
import { getStationMarkerColor } from '../../utils/mapUtils';

// Create a new interface that mimics the essential methods of google.maps.Marker
interface MarkerInterface {
  setMap(map: google.maps.Map | null): void;
  setIcon?(icon: any): void;
  get(key: string): any;
  set(key: string, value: any): void;
}

// Create an interface for our custom data storage
interface MarkerData {
  [key: string]: any;
}

class StationMarker {
  private markerInterface: MarkerInterface;
  private station: Station;
  private map: google.maps.Map;
  // Store custom data for markers
  private markerData: MarkerData = {};

  constructor(map: google.maps.Map, station: Station, onClick?: () => void, useStandardMarkers: boolean = false) {
    this.map = map;
    this.station = station;
    
    // Determine whether to use standard markers or advanced markers
    if (useStandardMarkers || !window.google.maps.marker || !window.google.maps.marker.AdvancedMarkerElement) {
      // Use standard markers as fallback
      const marker = new google.maps.Marker({
        map: this.map,
        position: {
          lat: Number(station.latitude),
          lng: Number(station.longitude),
        },
        title: station.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: getStationMarkerColor(this.station),
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: '#FFFFFF',
          scale: 8
        }
      });

      // Add click handler
      if (onClick) {
        marker.addListener('click', onClick);
      }

      // Store station ID in our data storage
      this.markerData.stationId = station.id;

      // Standard marker interface
      this.markerInterface = {
        setMap: (map: google.maps.Map | null) => {
          marker.setMap(map);
        },
        setIcon: (icon: any) => {
          if (typeof icon === 'string') {
            marker.setIcon({
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: icon,
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: '#FFFFFF',
              scale: 8
            });
          } else {
            marker.setIcon(icon);
          }
        },
        get: (key: string) => {
          if (key === 'stationId') {
            return this.markerData.stationId;
          }
          return undefined;
        },
        set: (key: string, value: any) => {
          // Store in our own data object
          this.markerData[key] = value;
        }
      };
    } else {
      // Use Advanced Markers if available
      try {
        // Create a pin for the advanced marker
        const pin = new google.maps.marker.PinElement({
          background: getStationMarkerColor(this.station),
          borderColor: '#FFFFFF',
          glyphColor: '#FFFFFF',
        });

        // Create the advanced marker
        const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
          map: this.map,
          position: {
            lat: Number(station.latitude),
            lng: Number(station.longitude),
          },
          title: station.name,
          content: pin.element,
        });

        // Set station ID as a data attribute
        advancedMarker.dataset.stationId = station.id;

        // Add click handler - using 'gmp-click' instead of 'click'
        if (onClick) {
          advancedMarker.addListener('gmp-click', onClick);
        }

        // Create a wrapper object that implements the MarkerInterface
        this.markerInterface = {
          // Implementation of setMap that controls the advanced marker
          setMap: (map: google.maps.Map | null) => {
            advancedMarker.map = map;
          },
          
          // Implementation of setIcon that updates the pin's appearance
          setIcon: (icon: any) => {
            if (typeof icon === 'string' && pin.element) {
              pin.element.style.backgroundColor = icon;
            }
          },
          
          // Custom implementation of the get method
          get: (key: string) => {
            if (key === 'stationId') {
              return station.id;
            }
            if (key === 'advancedMarker') {
              return advancedMarker;
            }
            return undefined;
          },
          
          // Custom implementation of the set method
          set: (key: string, value: any) => {
            // Storing properties on the advancedMarker is not directly supported
            // So we add them to our wrapper or to the dataset where possible
            if (key === 'stationId') {
              advancedMarker.dataset.stationId = value;
            }
          }
        };
      } catch (error) {
        console.warn("Failed to create Advanced Marker, falling back to standard marker", error);
        
        // Create standard marker as fallback
        const marker = new google.maps.Marker({
          map: this.map,
          position: {
            lat: Number(station.latitude),
            lng: Number(station.longitude),
          },
          title: station.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: getStationMarkerColor(this.station),
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#FFFFFF',
            scale: 8
          }
        });

        // Add click handler
        if (onClick) {
          marker.addListener('click', onClick);
        }

        // Store station ID in our data storage
        this.markerData.stationId = station.id;

        // Standard marker interface
        this.markerInterface = {
          setMap: (map: google.maps.Map | null) => {
            marker.setMap(map);
          },
          setIcon: (icon: any) => {
            if (typeof icon === 'string') {
              marker.setIcon({
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: icon,
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: '#FFFFFF',
                scale: 8
              });
            } else {
              marker.setIcon(icon);
            }
          },
          get: (key: string) => {
            if (key === 'stationId') {
              return this.markerData.stationId;
            }
            return undefined;
          },
          set: (key: string, value: any) => {
            // Store in our own data object
            this.markerData[key] = value;
          }
        };
      }
    }
  }

  public getMarker(): MarkerInterface {
    return this.markerInterface;
  }

  public remove(): void {
    const advancedMarker = this.markerInterface.get('advancedMarker');
    if (advancedMarker) {
      advancedMarker.map = null;
    } else {
      this.markerInterface.setMap(null);
    }
  }
}

export default StationMarker;