// src/components/map/MarkerCluster.tsx
import { Station } from '../../types/station';
import { calculateMapCenter } from '../../utils/mapUtils';

// Create a new interface that mimics the essential methods of google.maps.Marker
interface MarkerInterface {
  setMap(map: google.maps.Map | null): void;
  get(key: string): any;
  set(key: string, value: any): void;
}

// Create an interface for our custom data storage
interface MarkerData {
  [key: string]: any;
}

class MarkerCluster {
  private markerInterface: MarkerInterface;
  private stations: Station[];
  private map: google.maps.Map;
  // Store custom data for markers
  private markerData: MarkerData = {};

  constructor(map: google.maps.Map, stations: Station[], onClick?: () => void, useStandardMarkers: boolean = false) {
    this.map = map;
    this.stations = stations;
    
    // Calculate cluster center
    const [lat, lng] = calculateMapCenter(stations);
    
    // Determine whether to use standard markers or advanced markers
    if (useStandardMarkers || !window.google.maps.marker || !window.google.maps.marker.AdvancedMarkerElement) {
      // Use standard markers as fallback
      const marker = new google.maps.Marker({
        map: this.map,
        position: { lat, lng },
        title: `Cluster of ${stations.length} stations`,
        label: {
          text: stations.length.toString(),
          color: '#FFFFFF',
          fontWeight: 'bold'
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#2a9d8f',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#FFFFFF',
          scale: Math.min(22, Math.max(16, 16 + Math.floor(stations.length / 5))) / 2
        }
      });

      // Add click handler
      if (onClick) {
        marker.addListener('click', onClick);
      }

      // Standard marker interface
      this.markerInterface = {
        setMap: (map: google.maps.Map | null) => {
          marker.setMap(map);
        },
        get: (key: string) => {
          // Return data from our custom storage
          return this.markerData[key];
        },
        set: (key: string, value: any) => {
          // Store in our own data object
          this.markerData[key] = value;
        }
      };
    } else {
      try {
        // Create a custom element for the cluster
        const element = document.createElement('div');
        element.className = 'cluster-marker';
        
        // Scale the size based on count
        const scale = Math.min(22, Math.max(16, 16 + Math.floor(stations.length / 5)));
        
        element.style.width = `${scale}px`;
        element.style.height = `${scale}px`;
        element.style.borderRadius = '50%';
        element.style.backgroundColor = '#2a9d8f';
        element.style.border = '2px solid #FFFFFF';
        element.style.display = 'flex';
        element.style.justifyContent = 'center';
        element.style.alignItems = 'center';
        element.style.color = '#FFFFFF';
        element.style.fontSize = '12px';
        element.style.fontWeight = 'bold';
        element.textContent = stations.length.toString();

        // Create the advanced marker
        const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
          map: this.map,
          position: { lat, lng },
          content: element,
          zIndex: 1000
        });

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
          
          // Custom implementation of the get method
          get: (key: string) => {
            if (key === 'advancedMarker') {
              return advancedMarker;
            }
            // Return data from our custom storage
            return this.markerData[key];
          },
          
          // Custom implementation of the set method
          set: (key: string, value: any) => {
            // Store in our own data object
            this.markerData[key] = value;
          }
        };
      } catch (error) {
        console.warn("Failed to create Advanced Marker Cluster, falling back to standard marker", error);
        
        // Create standard marker as fallback
        const marker = new google.maps.Marker({
          map: this.map,
          position: { lat, lng },
          title: `Cluster of ${stations.length} stations`,
          label: {
            text: stations.length.toString(),
            color: '#FFFFFF',
            fontWeight: 'bold'
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#2a9d8f',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            scale: Math.min(22, Math.max(16, 16 + Math.floor(stations.length / 5))) / 2
          }
        });

        // Add click handler
        if (onClick) {
          marker.addListener('click', onClick);
        }

        // Standard marker interface
        this.markerInterface = {
          setMap: (map: google.maps.Map | null) => {
            marker.setMap(map);
          },
          get: (key: string) => {
            // Return data from our custom storage
            return this.markerData[key];
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

export default MarkerCluster;