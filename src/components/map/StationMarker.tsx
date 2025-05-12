import { Station } from '../../types/station';
import { getStationMarkerColor } from '../../utils/mapUtils';

// Create a new interface that mimics the essential methods of google.maps.Marker
// This allows us to return either the legacy Marker or our AdvancedMarker wrapper
interface MarkerInterface {
  setMap(map: google.maps.Map | null): void;
  setIcon(icon: any): void;
  get(key: string): any;
  set(key: string, value: any): void;
}

class StationMarker {
  private markerInterface: MarkerInterface;
  private station: Station;
  private map: google.maps.Map;

  constructor(map: google.maps.Map, station: Station, onClick?: () => void) {
    this.map = map;
    this.station = station;
    
    // Check if AdvancedMarkerElement is available
    if (window.google?.maps?.marker?.AdvancedMarkerElement) {
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
        
        return;
      } catch (error) {
        console.warn('Failed to create AdvancedMarkerElement, falling back to legacy Marker', error);
        // Continue with legacy marker as fallback
      }
    }
    
    // Fallback to legacy marker if AdvancedMarkerElement isn't available or fails
    // Note: This will still show the deprecation warning, but only as a fallback
    const legacyMarker = new google.maps.Marker({
      position: {
        lat: Number(station.latitude),
        lng: Number(station.longitude),
      },
      map: this.map,
      title: station.name,
      icon: this.createMarkerIcon(),
      animation: google.maps.Animation.DROP,
    });

    // Store station ID
    legacyMarker.set('stationId', station.id);

    // Add click handler
    if (onClick) {
      legacyMarker.addListener('click', onClick);
    }
    
    // Use the legacy marker as our interface implementation
    this.markerInterface = legacyMarker;
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

export default StationMarker;