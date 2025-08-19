"use client";

import { useState } from 'react';
import { Star, Users, MapPin, Wifi, Car, Clock, Plus, Check } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gym } from '@/types/gym';

interface GymCardProps {
  gym: Gym;
  isSelected: boolean;
  onSelect: (gymId: string) => void;
  onViewDetails: (gymId: string) => void;
}

const getOccupancyColor = (occupancy: number) => {
  if (occupancy < 30) return 'bg-green-500';
  if (occupancy < 70) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getOccupancyLabel = (occupancy: number) => {
  if (occupancy < 30) return 'Baja';
  if (occupancy < 70) return 'Moderada';
  return 'Alta';
};

export default function GymCard({ gym, isSelected, onSelect, onViewDetails }: GymCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const amenityIcons: Record<string, any> = {
    'WiFi Gratis': Wifi,
    'Aparcamiento': Car,
    'Acceso 24/7': Clock,
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={gym.image}
            alt={gym.name}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 animate-pulse" />
          )}
          
          {/* Price Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 text-gray-900 font-semibold px-3 py-1 text-sm">
              ${gym.monthlyPrice}/mes
            </Badge>
          </div>

          {/* Selection Button */}
          <div className="absolute top-4 right-4">
            <Button
              size="sm"
              variant={isSelected ? "default" : "secondary"}
              onClick={() => onSelect(gym.id)}
              className={`${
                isSelected 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-white/90 hover:bg-white text-gray-900'
              } transition-all duration-200`}
            >
              {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {gym.name}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              {gym.location} {gym.distance && `• ${gym.distance} mi`}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900">{gym.rating}</span>
            <span className="text-sm text-gray-500">({gym.reviews})</span>
          </div>
        </div>

        {/* Current Occupancy */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getOccupancyColor(gym.currentOccupancy)}`} />
              <span className="text-sm font-medium text-gray-700">
                Ocupación {getOccupancyLabel(gym.currentOccupancy).toLowerCase()}
              </span>
            </div>
            <span className="text-sm text-gray-500">{gym.currentOccupancy}% lleno</span>
          </div>
          <Progress 
            value={gym.currentOccupancy} 
            className="h-2"
            indicatorClassName={getOccupancyColor(gym.currentOccupancy)}
          />
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {gym.amenities.slice(0, 4).map((amenity) => {
              const Icon = amenityIcons[amenity];
              return (
                <div
                  key={amenity}
                  className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1"
                >
                  {Icon && <Icon className="w-3 h-3 text-gray-600" />}
                  <span className="text-xs text-gray-600">{amenity}</span>
                </div>
              );
            })}
            {gym.amenities.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{gym.amenities.length - 4} más
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(gym.id)}
          >
            Ver Detalles
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => window.open(`tel:${gym.phone}`, '_self')}
          >
            Llamar Ahora
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}