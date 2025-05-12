/// <reference types="@types/google.maps" />

// Augment the google.maps namespace with the marker API which includes AdvancedMarkerElement
declare global {
  namespace google.maps {
    namespace marker {
      class AdvancedMarkerElement extends google.maps.MVCObject {
        constructor(options?: AdvancedMarkerElementOptions);
        position: google.maps.LatLng | google.maps.LatLngLiteral | null;
        title: string | null;
        map: google.maps.Map | null;
        zIndex: number | null;
        content: Node | null;
        dataset: DOMStringMap;
        collisionBehavior: string | null;
        
        addListener(eventName: string, handler: Function): google.maps.MapsEventListener;
      }
      
      interface AdvancedMarkerElementOptions {
        position?: google.maps.LatLng | google.maps.LatLngLiteral;
        title?: string;
        map?: google.maps.Map;
        zIndex?: number;
        content?: Node;
        collisionBehavior?: string;
      }
      
      class PinElement {
        constructor(options?: PinElementOptions);
        element: HTMLElement;
        background: string;
        borderColor: string;
        glyphColor: string;
        scale: number;
      }
      
      interface PinElementOptions {
        background?: string;
        borderColor?: string;
        glyphColor?: string;
        scale?: number;
        glyph?: string | Node;
      }
    }
  }

  interface Window {
    initMap: () => void;
    [key: string]: any;
  }
}

export {};