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
        // No specific implementations needed for this class
      }
    };
  }

  public getMarker(): MarkerInterface {
    return this.markerInterface;
  }

  public remove(): void {
    const advancedMarker = this.markerInterface.get('advancedMarker');
    if (advancedMarker) {
      advancedMarker.map = null;
    }
  }
}

export default MarkerCluster;