/**
 * Format a date string to a localized date and time
 */
export const formatDateTime = (dateString: string, locale = 'et-EE'): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  /**
   * Format a date string to a localized date
   */
  export const formatDate = (dateString: string, locale = 'et-EE'): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  /**
   * Format a reliability score (0-100) with appropriate color and symbol
   */
  export const formatReliabilityScore = (score: number): { value: string, color: string, symbol: string } => {
    if (score === undefined || score === null) {
      return { value: '?', color: '#95a5a6', symbol: '?' };
    }
    
    const value = Math.round(score).toString();
    
    if (score >= 90) {
      return { value, color: '#27ae60', symbol: '★★★★★' }; // Excellent - Green
    } else if (score >= 80) {
      return { value, color: '#2ecc71', symbol: '★★★★☆' }; // Very good - Green
    } else if (score >= 70) {
      return { value, color: '#f39c12', symbol: '★★★☆☆' }; // Good - Yellow
    } else if (score >= 50) {
      return { value, color: '#e67e22', symbol: '★★☆☆☆' }; // Fair - Orange
    } else {
      return { value, color: '#e74c3c', symbol: '★☆☆☆☆' }; // Poor - Red
    }
  };
  
  /**
   * Format distance based on locale preference (km or miles)
   */
  export const formatDistance = (meters: number, useImperial = false): string => {
    if (useImperial) {
      const miles = meters / 1609.34;
      if (miles < 0.1) {
        return `${Math.round(miles * 5280)} ft`;
      }
      return `${miles.toFixed(1)} mi`;
    } else {
      const kilometers = meters / 1000;
      if (kilometers < 1) {
        return `${Math.round(meters)} m`;
      }
      return `${kilometers.toFixed(1)} km`;
    }
  };
  
  /**
   * Format power in kilowatts
   */
  export const formatPower = (powerKw: number): string => {
    if (!powerKw && powerKw !== 0) return '';
    return `${powerKw} kW`;
  };