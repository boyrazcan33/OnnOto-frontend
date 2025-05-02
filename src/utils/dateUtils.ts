/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  /**
   * Calculate the time elapsed since a given date
   */
  export const timeElapsedSince = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    
    const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (secondsAgo < 60) {
      return 'just now';
    }
    
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
      return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
    }
    
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
      return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
    }
    
    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 30) {
      return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
    }
    
    const monthsAgo = Math.floor(daysAgo / 30);
    if (monthsAgo < 12) {
      return `${monthsAgo} month${monthsAgo !== 1 ? 's' : ''} ago`;
    }
    
    const yearsAgo = Math.floor(monthsAgo / 12);
    return `${yearsAgo} year${yearsAgo !== 1 ? 's' : ''} ago`;
  };
  
  /**
   * Get a date range for the last X days
   */
  export const getLastDaysRange = (days: number): { startDate: Date, endDate: Date } => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return { startDate, endDate };
  };
  
  /**
   * Format date to ISO string for API requests
   */
  export const formatDateForApi = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };