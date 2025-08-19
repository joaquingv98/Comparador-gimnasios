import { Gym, OccupancyDataPoint } from '@/types/gym';

// Generate realistic occupancy data for a week
export const generateOccupancyData = (): OccupancyDataPoint[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data: OccupancyDataPoint[] = [];

  days.forEach(day => {
    for (let hour = 6; hour <= 22; hour++) {
      let occupancy = 20; // Base occupancy

      // Peak hours logic
      if (hour >= 7 && hour <= 9) occupancy += 40; // Morning rush
      if (hour >= 17 && hour <= 20) occupancy += 50; // Evening rush
      if (day === 'Sat' || day === 'Sun') {
        if (hour >= 10 && hour <= 14) occupancy += 35; // Weekend afternoon
      }

      // Add some randomization
      occupancy += Math.random() * 20 - 10;
      occupancy = Math.max(0, Math.min(100, occupancy));

      data.push({
        hour,
        occupancy: Math.round(occupancy),
        day
      });
    }
  });

  return data;
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const mockGyms: Gym[] = [
  {
    id: '1',
    name: 'FitLife Premium',
    location: 'Centro de Madrid',
    address: 'Calle Gran Vía 123, Madrid, 28013',
    distance: 0.8,
    monthlyPrice: 89,
    rating: 4.8,
    reviews: 324,
    currentOccupancy: 0,
    occupancyData: [],
    amenities: ['WiFi Gratis', 'Entrenamiento Personal', 'Piscina', 'Sauna', 'Aparcamiento', 'Clases Grupales'],
    image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800',
    phone: '+34 91 123 4567',
    hours: {
      'Lun-Vie': { open: '5:00', close: '23:00' },
      'Sáb-Dom': { open: '6:00', close: '22:00' }
    },
    coordinates: { lat: 40.7589, lng: -73.9851 }
  },
  {
    id: '2',
    name: 'Iron Paradise',
    location: 'Salamanca',
    address: 'Calle Serrano 456, Madrid, 28001',
    distance: 1.2,
    monthlyPrice: 125,
    rating: 4.6,
    reviews: 189,
    currentOccupancy: 0,
    occupancyData: [],
    amenities: ['Acceso 24/7', 'Entrenamiento Personal', 'WiFi Gratis', 'Vestuarios', 'Aparcamiento'],
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
    phone: '+34 91 234 5678',
    hours: {
      'Lun-Dom': { open: '24h', close: '24h' }
    },
    coordinates: { lat: 40.7614, lng: -73.9776 }
  },
  {
    id: '3',
    name: 'Urban Fitness',
    location: 'Malasaña',
    address: 'Calle Fuencarral 789, Madrid, 28004',
    distance: 2.1,
    monthlyPrice: 65,
    rating: 4.3,
    reviews: 256,
    currentOccupancy: 0,
    occupancyData: [],
    amenities: ['Clases Grupales', 'WiFi Gratis', 'Vestuarios', 'Guardería'],
    image: 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=800',
    phone: '+34 91 345 6789',
    hours: {
      'Lun-Vie': { open: '6:00', close: '22:00' },
      'Sáb-Dom': { open: '7:00', close: '21:00' }
    },
    coordinates: { lat: 40.7505, lng: -74.0027 }
  },
  {
    id: '4',
    name: 'Elite Training Center',
    location: 'Chamberí',
    address: 'Calle Bravo Murillo 321, Madrid, 28003',
    distance: 2.8,
    monthlyPrice: 150,
    rating: 4.9,
    reviews: 142,
    currentOccupancy: 0,
    occupancyData: [],
    amenities: ['Entrenamiento Personal', 'Piscina', 'Sauna', 'Cafetería', 'Aparcamiento', 'WiFi Gratis'],
    image: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=800',
    phone: '+34 91 456 7890',
    hours: {
      'Lun-Vie': { open: '5:30', close: '22:30' },
      'Sáb-Dom': { open: '7:00', close: '21:00' }
    },
    coordinates: { lat: 40.7831, lng: -73.9712 }
  },
  {
    id: '5',
    name: 'Budget Fitness Hub',
    location: 'Lavapiés',
    address: 'Calle Embajadores 654, Madrid, 28012',
    distance: 1.9,
    monthlyPrice: 35,
    rating: 4.0,
    reviews: 89,
    currentOccupancy: 0,
    occupancyData: [],
    amenities: ['Acceso 24/7', 'WiFi Gratis', 'Vestuarios'],
    image: 'https://images.pexels.com/photos/1547248/pexels-photo-1547248.jpeg?auto=compress&cs=tinysrgb&w=800',
    phone: '+34 91 567 8901',
    hours: {
      'Lun-Dom': { open: '24h', close: '24h' }
    },
    coordinates: { lat: 40.7184, lng: -73.9857 }
  },
  {
    id: '6',
    name: 'Wellness Studio',
    location: 'Retiro',
    address: 'Calle Alcalá 987, Madrid, 28009',
    distance: 3.5,
    monthlyPrice: 95,
    rating: 4.5,
    reviews: 167,
    currentOccupancy: 0,
    occupancyData: [],
    amenities: ['Clases Grupales', 'Entrenamiento Personal', 'WiFi Gratis', 'Cafetería', 'Aparcamiento'],
    image: 'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=800',
    phone: '+34 91 678 9012',
    hours: {
      'Lun-Vie': { open: '6:00', close: '21:00' },
      'Sáb-Dom': { open: '8:00', close: '20:00' }
    },
    coordinates: { lat: 40.6962, lng: -73.9957 }
  }
];

// Function to update gym distances based on user location
export const updateGymDistances = (gyms: Gym[], userLocation: { lat: number; lng: number }): Gym[] => {
  return gyms.map(gym => ({
    ...gym,
    distance: Number(calculateDistance(
      userLocation.lat,
      userLocation.lng,
      gym.coordinates.lat,
      gym.coordinates.lng
    ).toFixed(1))
  }));
};