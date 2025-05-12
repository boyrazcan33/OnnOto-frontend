// src/components/map/MarkerCluster.tsx
import { Station } from '../../types/station';
import { calculateMapCenter } from '../../utils/mapUtils';

class MarkerCluster {
  private marker: google.maps.Marker;
  private stations: Station[];
  private map: google.maps.Map;

  constructor(map: google.maps.Map, stations: Station[], onClick?: () => void) {
    this.map = map;
    this.stations = stations;
    
    // Calculate cluster center
    const [lat, lng] = calculateMapCenter(stations);
    
    // Create a standard Google Maps marker for the cluster
    this.marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
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
      this.marker.addListener('click', onClick);
    }
  }

  public getMarker(): google.maps.Marker {
    return this.marker;
  }

  public remove(): void {
    this.marker.setMap(null);
  }
}

export default MarkerCluster;