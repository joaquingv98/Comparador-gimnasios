"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Filter, Star, Users, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GymCard from '@/components/GymCard';
import FilterSidebar from '@/components/FilterSidebar';
import OccupancyChart from '@/components/OccupancyChart';
import ComparisonPanel from '@/components/ComparisonPanel';
import { mockGyms, generateOccupancyData } from '@/lib/mockData';
import { Gym, FilterState } from '@/types/gym';

export default function Home() {
  const [gyms, setGyms] = useState<Gym[]>(mockGyms);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGyms, setSelectedGyms] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 150],
    rating: 0,
    distance: 25,
    amenities: [],
    sortBy: 'distance'
  });

  // Simulate real-time occupancy updates
  useEffect(() => {
    // Initial update to populate occupancy data after hydration
    setGyms(prev => prev.map(gym => ({
      ...gym,
      currentOccupancy: Math.floor(Math.random() * 100),
      occupancyData: generateOccupancyData()
    })));

    const interval = setInterval(() => {
      setGyms(prev => prev.map(gym => ({
        ...gym,
        currentOccupancy: Math.floor(Math.random() * 100),
        occupancyData: generateOccupancyData()
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied');
          // Set default location (NYC)
          setUserLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    }
  }, []);

  // Filter and sort gyms
  const filteredGyms = useMemo(() => {
    let filtered = gyms.filter(gym => {
      // Search query
      if (searchQuery && !gym.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !gym.location.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Price range
      if (gym.monthlyPrice < filters.priceRange[0] || gym.monthlyPrice > filters.priceRange[1]) {
        return false;
      }

      // Rating
      if (gym.rating < filters.rating) {
        return false;
      }

      // Distance (if location available)
      if (userLocation && gym.distance > filters.distance) {
        return false;
      }

      // Amenities
      if (filters.amenities.length > 0 && 
          !filters.amenities.every(amenity => gym.amenities.includes(amenity))) {
        return false;
      }

      return true;
    });

    // Sort results
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return a.monthlyPrice - b.monthlyPrice;
        case 'rating':
          return b.rating - a.rating;
        case 'occupancy':
          return a.currentOccupancy - b.currentOccupancy;
        case 'distance':
        default:
          return (a.distance || 0) - (b.distance || 0);
      }
    });

    return filtered;
  }, [gyms, searchQuery, filters, userLocation]);

  const handleGymSelect = (gymId: string) => {
    setSelectedGyms(prev => 
      prev.includes(gymId) 
        ? prev.filter(id => id !== gymId)
        : [...prev, gymId].slice(0, 3) // Max 3 comparisons
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">GymFinder</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar gimnasios o ubicaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 w-full"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'} mb-6 lg:mb-0`}>
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              resultCount={filteredGyms.length}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredGyms.length} gimnasios encontrados
                </h2>
                {userLocation && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    Cerca de tu ubicación
                  </div>
                )}
              </div>
              
              <Select
                value={filters.sortBy}
                onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value }))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Ordenar por Distancia</SelectItem>
                  <SelectItem value="price">Ordenar por Precio</SelectItem>
                  <SelectItem value="rating">Ordenar por Valoración</SelectItem>
                  <SelectItem value="occupancy">Ordenar por Ocupación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gym Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {filteredGyms.map((gym) => (
                <GymCard
                  key={gym.id}
                  gym={gym}
                  isSelected={selectedGyms.includes(gym.id)}
                  onSelect={handleGymSelect}
                  onViewDetails={(gymId) => {
                    // Handle view details
                    console.log('View details for gym:', gymId);
                  }}
                />
              ))}
            </div>

            {filteredGyms.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron gimnasios</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Intenta ajustar tus criterios de búsqueda o ampliar el radio de ubicación.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Panel */}
      {selectedGyms.length > 0 && (
        <ComparisonPanel
          selectedGymIds={selectedGyms}
          gyms={gyms}
          onRemoveGym={(gymId) => setSelectedGyms(prev => prev.filter(id => id !== gymId))}
          onClearAll={() => setSelectedGyms([])}
        />
      )}
    </div>
  );
}