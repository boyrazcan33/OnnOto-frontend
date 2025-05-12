// src/components/map/StationMarker.tsx
import { Station } from '../../types/station';
import { getStationMarkerColor } from '../../utils/mapUtils';

class StationMarker {
  private marker: google.maps.Marker;
  private station: Station;

  constructor(map: google.maps.Map, station: Station, onClick?: () => void) {
    this.station = station;
    
    // Create a standard Google Maps marker
    this.marker = new google.maps.Marker({
      position: {
        lat: Number(station.latitude),
        lng: Number(station.longitude)
      },
      map: map,
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

    // Store station ID on the marker for future updates
    this.marker.set("stationId", station.id);

    // Add click handler
    if (onClick) {
      this.marker.addListener('click', onClick);
    }
  }

  public getMarker(): google.maps.Marker {
    return this.marker;
  }

  public setIcon(color: string): void {
    this.marker.setIcon({
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 1,
      strokeColor: '#FFFFFF',
      scale: 8
    });
  }

  public remove(): void {
    this.marker.setMap(null);
  }
}

export default StationMarker;