import { analyticsService, AnalyticsEvent } from '../services/analyticsService';

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  VALIDATION = 'VALIDATION',
  PERMISSION = 'PERMISSION',
  LOCATION = 'LOCATION',
  STORAGE = 'STORAGE',
  UNKNOWN = 'UNKNOWN'
}

// Custom error class
export class AppError extends Error {
  constructor(
    public type: ErrorType,
    public message: string,
    public originalError?: any,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Error handling utilities
export const errorHandlers = {
  handleApiError: (error: any): AppError => {
    let type = ErrorType.API;
    let message = 'An unexpected error occurred';
    let code = 'API_ERROR';

    if (!navigator.onLine) {
      type = ErrorType.NETWORK;
      message = 'No internet connection';
      code = 'NETWORK_ERROR';
    } else if (error.response) {
      // Handle specific API error responses
      const status = error.response.status;
      switch (status) {
        case 400:
          message = 'Invalid request';
          code = 'BAD_REQUEST';
          break;
        case 401:
          message = 'Unauthorized';
          code = 'UNAUTHORIZED';
          break;
        case 403:
          message = 'Access denied';
          code = 'FORBIDDEN';
          break;
        case 404:
          message = 'Resource not found';
          code = 'NOT_FOUND';
          break;
        case 429:
          message = 'Too many requests';
          code = 'RATE_LIMIT';
          break;
        case 500:
          message = 'Server error';
          code = 'SERVER_ERROR';
          break;
        default:
          message = error.response.data?.message || message;
          code = error.response.data?.code || code;
      }
    }

    const appError = new AppError(type, message, error, code);
    
    // Track error in analytics
    analyticsService.trackEvent(AnalyticsEvent.ERROR_OCCUR, {
      type,
      code,
      message,
      stack: error?.stack
    });

    return appError;
  },

  handleLocationError: (error: GeolocationPositionError): AppError => {
    let message = 'Location error';
    let code = 'LOCATION_ERROR';

    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = 'Location permission denied';
        code = 'LOCATION_PERMISSION_DENIED';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Location unavailable';
        code = 'LOCATION_UNAVAILABLE';
        break;
      case error.TIMEOUT:
        message = 'Location request timed out';
        code = 'LOCATION_TIMEOUT';
        break;
    }

    return new AppError(ErrorType.LOCATION, message, error, code);
  },

  handleStorageError: (error: any): AppError => {
    return new AppError(
      ErrorType.STORAGE,
      'Storage operation failed',
      error,
      'STORAGE_ERROR'
    );
  },

  handlePermissionError: (error: any): AppError => {
    return new AppError(
      ErrorType.PERMISSION,
      'Permission denied',
      error,
      'PERMISSION_DENIED'
    );
  },

  isAppError: (error: any): error is AppError => {
    return error instanceof AppError;
  },

  getErrorMessage: (error: any): string => {
    if (errorHandlers.isAppError(error)) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
};