export const FILTER_OPTIONS = {
    STATUSES: ['AVAILABLE', 'OCCUPIED', 'OFFLINE', 'UNKNOWN'],
    RELIABILITY_RANGES: [
      { min: 90, max: 100, label: 'Excellent' },
      { min: 80, max: 89, label: 'Very Good' },
      { min: 70, max: 79, label: 'Good' },
      { min: 50, max: 69, label: 'Fair' },
      { min: 0, max: 49, label: 'Poor' }
    ],
    SORT_OPTIONS: [
      { value: 'reliability', label: 'Reliability' },
      { value: 'distance', label: 'Distance' },
      { value: 'name', label: 'Name' }
    ]
  };