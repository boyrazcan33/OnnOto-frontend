/// <reference types="@types/google.maps" />

declare global {
    interface Window {
      google: typeof google;
      initMap: () => void;
      [key: string]: any; // Allow dynamic property names for other callback functions
    }
  }
  
  export {};