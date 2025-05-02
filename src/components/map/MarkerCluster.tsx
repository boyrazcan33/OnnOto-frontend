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
    
    // Create marker
    this.marker = new google.maps.Marker({
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
      this.marker.addListener('click', onClick);
    }
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

  public getMarker(): google.maps.Marker {
    return this.marker;
  }

  public remove(): void {
    this.marker.setMap(null);
  }
}

export default MarkerCluster;