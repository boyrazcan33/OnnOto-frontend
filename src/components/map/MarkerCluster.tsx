import { Station } from '../../types/station';
import { calculateMapCenter } from '../../utils/mapUtils';

// Create a new interface that mimics the essential methods of google.maps.Marker
interface MarkerInterface {
  setMap(map: google.maps.Map | null): void;
  get(key: string): any;
  set(key: string, value: any): void;
}

class MarkerCluster {
  private markerInterface: MarkerInterface;
  private stations: Station[];
  private map: google.maps.Map;

  constructor(map: google.maps.Map, stations: Station[], onClick?: () => void) {
    this.map = map;
    this.stations = stations;
    
    // Calculate cluster center
    const [lat, lng] = calculateMapCenter(stations);
    
    // Try to use AdvancedMarkerElement if available
    if (window.google?.maps?.marker?.AdvancedMarkerElement) {
      try {
        // Scale the size based on count
        const scale = Math.min(22, Math.max(16, 16 + Math.floor(stations.length / 5)));
        
        // Create a custom element for the cluster
        const element = document.createElement('div');
        element.className = 'cluster-marker';
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

        // Add click handler
        if (onClick) {
          advancedMarker.addListener('click', onClick);
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
            return undefined;
          },
          
          // Custom implementation of the set method
          set: (key: string, value: any) => {
            // Store properties on our wrapper
            // No specific implementations needed for this class
          }
        };
        
        return;
      } catch (error) {
        console.warn('Failed to create AdvancedMarkerElement for cluster, falling back to legacy Marker', error);
        // Continue with legacy marker as fallback
      }
    }
    
    // Fallback to legacy marker
    const legacyMarker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      label: {
        text: stations.length.toString(),
        color: '#FFFFFF',
        fontSize: '12px'
      },
      icon: this.createClusterIcon(stations.length),
      zIndex: 1000,
    });

    // Add click handler
    if (onClick) {
      legacyMarker.addListener('click', onClick);
    }
    
    // Use the legacy marker as our interface implementation
    this.markerInterface = legacyMarker;
  }

  private createClusterIcon(count: number): google.maps.Symbol {
    // Scale the icon based on count
    const scale = Math.min(22, Math.max(16, 16 + Math.floor(count / 5)));
    
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillOpacity: 0.9,
      fillColor: '#2a9d8f',
      strokeWeight: 2,
      strokeColor: '#FFFFFF',
      scale: scale
    };
  }

  public getMarker(): MarkerInterface {
    return this.markerInterface;
  }

  public remove(): void {
    // Handle both advanced and legacy markers
    const advancedMarker = this.markerInterface.get('advancedMarker');
    if (advancedMarker) {
      advancedMarker.map = null;
    } else {
      this.markerInterface.setMap(null);
    }
  }
}

export default MarkerCluster;