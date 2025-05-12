import { Station } from '../../types/station';
import { getStationMarkerColor } from '../../utils/mapUtils';

class StationMarker {
  private marker: google.maps.Marker;
  private station: Station;
  private map: google.maps.Map;

  constructor(map: google.maps.Map, station: Station, onClick?: () => void) {
    this.map = map;
    this.station = station;
    
    // Try to use AdvancedMarkerElement if available
    if (window.google?.maps?.marker?.AdvancedMarkerElement) {
      try {
        // Create an advanced marker (new recommended way)
        const pin = new google.maps.marker.PinElement({
          background: getStationMarkerColor(this.station),
          borderColor: '#FFFFFF',
          glyphColor: '#FFFFFF',
        });

        const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
          map: this.map,
          position: {
            lat: Number(station.latitude),
            lng: Number(station.longitude),
          },
          title: station.name,
          content: pin.element,
        });

        // Add custom property for station ID to support updates
        advancedMarker.dataset.stationId = station.id;

        // Add click handler
        if (onClick) {
          advancedMarker.addListener('click', onClick);
        }

        // Create a legacy marker as fallback but don't add it to the map
        this.marker = new google.maps.Marker({
          position: {
            lat: Number(station.latitude),
            lng: Number(station.longitude),
          },
          title: station.name,
          icon: this.createMarkerIcon(),
        });

        // Store the advanced marker in a property of the legacy marker for compatibility
        this.marker.set('advancedMarker', advancedMarker);
        this.marker.set('stationId', station.id);

        // Override setMap to control the advanced marker
        const originalSetMap = this.marker.setMap;
        this.marker.setMap = (map: google.maps.Map | null) => {
          advancedMarker.map = map;
          return originalSetMap.call(this.marker, null); // Don't actually show the legacy marker
        };

        // Override setIcon to update the advanced marker's appearance
        const originalSetIcon = this.marker.setIcon;
        this.marker.setIcon = (icon: any) => {
          if (typeof icon === 'string') {
            // If it's a color string, update the pin's background
            if (pin.element) {
              pin.element.style.backgroundColor = icon;
            }
          }
          return originalSetIcon.call(this.marker, icon);
        };
        
        return;
      } catch (error) {
        console.warn('Failed to create AdvancedMarkerElement, falling back to legacy Marker', error);
        // Continue with legacy marker as fallback
      }
    }
    
    // Fallback to legacy marker if AdvancedMarkerElement isn't available or fails
    this.marker = new google.maps.Marker({
      position: {
        lat: Number(station.latitude),
        lng: Number(station.longitude),
      },
      map: this.map,
      title: station.name,
      icon: this.createMarkerIcon(),
      animation: google.maps.Animation.DROP,
    });

    // Store station ID for updates
    this.marker.set('stationId', station.id);

    // Add click handler
    if (onClick) {
      this.marker.addListener('click', onClick);
    }
  }

  private createMarkerIcon(): google.maps.Symbol {
    const color = getStationMarkerColor(this.station);
    
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillOpacity: 1,
      fillColor: color,
      strokeWeight: 2,
      strokeColor: '#FFFFFF',
      scale: 10
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

export default StationMarker;