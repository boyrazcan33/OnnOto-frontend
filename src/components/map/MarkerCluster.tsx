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
    
    // Try to use AdvancedMarkerElement if available
    if (window.google?.maps?.marker?.AdvancedMarkerElement) {
      try {
        // Create an advanced marker for the cluster
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

        // Create a legacy marker as fallback but don't add it to the map
        this.marker = new google.maps.Marker({
          position: { lat, lng },
          icon: this.createClusterIcon(stations.length),
          zIndex: 1000,
        });

        // Store the advanced marker in a property of the legacy marker for compatibility
        this.marker.set('advancedMarker', advancedMarker);

        // Override setMap to control the advanced marker
        const originalSetMap = this.marker.setMap;
        this.marker.setMap = (map: google.maps.Map | null) => {
          advancedMarker.map = map;
          return originalSetMap.call(this.marker, null); // Don't actually show the legacy marker
        };
        
        return;
      } catch (error) {
        console.warn('Failed to create AdvancedMarkerElement for cluster, falling back to legacy Marker', error);
        // Continue with legacy marker as fallback
      }
    }
    
    // Fallback to legacy marker
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
    // Handle both advanced and legacy markers
    const advancedMarker = this.marker.get('advancedMarker');
    if (advancedMarker) {
      advancedMarker.map = null;
    }
    this.marker.setMap(null);
  }
}

export default MarkerCluster;