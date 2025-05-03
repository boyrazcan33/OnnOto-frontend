// src/utils/mapUtils.ts
import { Station } from '../types/station';
import { CONNECTOR_STATUS, STATUS_COLORS } from '../constants/statusTypes';

/**
 * Calculate the center point for a set of stations
 */
export const calculateMapCenter = (stations: Station[]): [number, number] => {
  if (!stations.length) {
    // Default to Estonia's center if no stations
    return [58.5953, 25.0136];
  }

  // Calculate average latitude and longitude
  const sum = stations.reduce(
    (acc, station) => {
      return {
        lat: acc.lat + Number(station.latitude),
        lng: acc.lng + Number(station.longitude)
      };
    },
    { lat: 0, lng: 0 }
  );

  return [sum.lat / stations.length, sum.lng / stations.length];
};

/**
 * Calculate appropriate zoom level based on stations distribution
 */
export const calculateZoomLevel = (stations: Station[]): number => {
  if (!stations.length || stations.length === 1) {
    return 10; // Default zoom for single station or empty set
  }

  // Calculate bounding box
  const bounds = stations.reduce(
    (box, station) => {
      const lat = Number(station.latitude);
      const lng = Number(station.longitude);
      return {
        minLat: Math.min(box.minLat, lat),
        maxLat: Math.max(box.maxLat, lat),
        minLng: Math.min(box.minLng, lng),
        maxLng: Math.max(box.maxLng, lng)
      };
    },
    {
      minLat: 90,
      maxLat: -90,
      minLng: 180,
      maxLng: -180
    }
  );

  // Calculate the largest span
  const latSpan = bounds.maxLat - bounds.minLat;
  const lngSpan = bounds.maxLng - bounds.minLng;
  const maxSpan = Math.max(latSpan, lngSpan);

  // Map span to zoom level (approximate)
  if (maxSpan > 4) return 6;
  if (maxSpan > 2) return 7;
  if (maxSpan > 1) return 8;
  if (maxSpan > 0.5) return 9;
  if (maxSpan > 0.2) return 10;
  if (maxSpan > 0.1) return 11;
  if (maxSpan > 0.05) return 12;
  if (maxSpan > 0.025) return 13;
  if (maxSpan > 0.0125) return 14;
  return 15;
};

/**
 * Determine the marker color based on station status
 */
export const getStationMarkerColor = (station: Station): string => {
  if (!station.totalConnectors) {
    return STATUS_COLORS.UNKNOWN;
  }

  if (station.availableConnectors === 0) {
    return STATUS_COLORS.OFFLINE;
  }

  if (station.availableConnectors < station.totalConnectors) {
    return STATUS_COLORS.OCCUPIED;
  }

  return STATUS_COLORS.AVAILABLE;
};

/**
 * Get marker icon based on status
 */
export const getMarkerIcon = (status: string): string => {
  switch (status) {
    case 'AVAILABLE':
      return STATUS_COLORS.AVAILABLE;
    case 'OCCUPIED':
      return STATUS_COLORS.OCCUPIED;
    case 'OFFLINE':
      return STATUS_COLORS.OFFLINE;
    default:
      return STATUS_COLORS.UNKNOWN;
  }
};

/**
 * Group nearby stations for clustering
 */
export const clusterStations = (
  stations: Station[],
  distanceThreshold: number = 100 // meters
): Station[][] => {
  const clusters: Station[][] = [];
  const processed = new Set<string>();

  stations.forEach(station => {
    // Skip already processed stations
    if (processed.has(station.id)) return;

    const cluster: Station[] = [station];
    processed.add(station.id);

    // Find nearby stations for this cluster
    stations.forEach(otherStation => {
      if (processed.has(otherStation.id)) return;

      const distance = calculateDistance(
        Number(station.latitude),
        Number(station.longitude),
        Number(otherStation.latitude),
        Number(otherStation.longitude)
      );

      if (distance <= distanceThreshold) {
        cluster.push(otherStation);
        processed.add(otherStation.id);
      }
    });

    clusters.push(cluster);
  });

  return clusters;
};

/**
 * Calculate distance between two coordinates in meters (Haversine formula)
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};