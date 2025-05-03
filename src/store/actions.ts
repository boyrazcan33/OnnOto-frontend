// src/store/actions.ts
import { createAction } from '@reduxjs/toolkit';
import { StationStatus, Anomaly, StationMetrics } from '../types/station';

export const updateStationStatus = createAction<{
  stationId: string;
  status: StationStatus;
}>('stations/updateStatus');

export const updateReliabilityScore = createAction<{
  stationId: string;
  metrics: StationMetrics;
}>('stations/updateReliabilityScore');

export const handleAnomalyDetection = createAction<{
  stationId: string;
  anomaly: Anomaly;
}>('stations/handleAnomalyDetection');