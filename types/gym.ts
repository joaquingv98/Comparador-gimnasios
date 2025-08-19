export interface Gym {
  id: string;
  name: string;
  location: string;
  address: string;
  distance?: number;
  monthlyPrice: number;
  rating: number;
  reviews: number;
  currentOccupancy: number;
  occupancyData: OccupancyDataPoint[];
  amenities: string[];
  image: string;
  phone: string;
  hours: {
    [key: string]: { open: string; close: string; };
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface OccupancyDataPoint {
  hour: number;
  occupancy: number;
  day: string;
}

export interface FilterState {
  priceRange: [number, number];
  rating: number;
  distance: number;
  amenities: string[];
  sortBy: 'distance' | 'price' | 'rating' | 'occupancy';
}

export interface UserLocation {
  lat: number;
  lng: number;
}