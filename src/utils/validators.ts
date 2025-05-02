export const validators = {
    isValidEmail: (email: string): boolean => {
      const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return pattern.test(email);
    },
  
    isValidDeviceId: (deviceId: string): boolean => {
      const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return pattern.test(deviceId);
    },
  
    isValidCoordinate: (coord: number, isLatitude: boolean = true): boolean => {
      if (isLatitude) {
        return coord >= -90 && coord <= 90;
      }
      return coord >= -180 && coord <= 180;
    },
  
    isValidRadius: (radius: number): boolean => {
      return radius > 0 && radius <= 50000; // max 50km
    },
  
    isValidReportType: (type: string): boolean => {
      const validTypes = ['OFFLINE', 'DAMAGED', 'INCORRECT_INFO', 'OCCUPIED'];
      return validTypes.includes(type);
    },
  
    isValidLanguage: (lang: string): boolean => {
      const supportedLanguages = ['et', 'en', 'ru'];
      return supportedLanguages.includes(lang);
    },
  
    isValidDate: (date: Date): boolean => {
      return date instanceof Date && !isNaN(date.getTime());
    },
  
    isValidPowerValue: (power: number): boolean => {
      return power > 0 && power <= 400; // max 400kW
    },
  
    isValidStatusType: (status: string): boolean => {
      const validStatuses = ['AVAILABLE', 'OCCUPIED', 'OFFLINE', 'UNKNOWN'];
      return validStatuses.includes(status);
    },
  
    hasRequiredFields: <T extends object>(
      obj: T,
      requiredFields: (keyof T)[]
    ): boolean => {
      return requiredFields.every(field => {
        const value = obj[field];
        return value !== undefined && value !== null && value !== '';
      });
    }
  };