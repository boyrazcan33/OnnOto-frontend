import { Station } from '../../types/station';
import { getStationMarkerColor } from '../../utils/mapUtils';

class StationMarker {
  private marker: google.maps.Marker;
  private station: Station;
  private map: google.maps.Map;

  constructor(map: google.maps.Map, station: Station, onClick?: () => void) {
    this.map = map;
    this.station = station;
    
    // Create marker
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
    this.marker.setMap(null);
  }
}

export default StationMarker;