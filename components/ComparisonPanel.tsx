"use client";

import { useState } from 'react';
import { X, Star, MapPin, DollarSign, Users, ArrowRight, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Gym } from '@/types/gym';
import OccupancyChart from './OccupancyChart';

interface ComparisonPanelProps {
  selectedGymIds: string[];
  gyms: Gym[];
  onRemoveGym: (gymId: string) => void;
  onClearAll: () => void;
}

export default function ComparisonPanel({ selectedGymIds, gyms, onRemoveGym, onClearAll }: ComparisonPanelProps) {
  const [expandedGym, setExpandedGym] = useState<string | null>(null);
  
  const selectedGyms = gyms.filter(gym => selectedGymIds.includes(gym.id));

  if (selectedGyms.length === 0) return null;

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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Comparar Gimnasios ({selectedGyms.length}/3)
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-gray-500 hover:text-gray-700"
          >
            Limpiar Todo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedGyms.map((gym) => (
            <Card key={gym.id} className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveGym(gym.id)}
                className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full hover:bg-red-100 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </Button>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between pr-6">
                  <div>
                    <CardTitle className="text-sm font-medium text-gray-900 mb-1">
                      {gym.name}
                    </CardTitle>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {gym.location}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">${gym.monthlyPrice}/mo</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm">{gym.rating}</span>
                  </div>
                </div>

                {/* Occupancy */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Ocupación Actual</span>
                    <span className="text-xs font-medium">{gym.currentOccupancy}%</span>
                  </div>
                  <Progress 
                    value={gym.currentOccupancy} 
                    className="h-2"
                    indicatorClassName={getOccupancyColor(gym.currentOccupancy)}
                  />
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full ${getOccupancyColor(gym.currentOccupancy)} mr-1`} />
                    <span className="text-xs text-gray-500">
                      Ocupación {getOccupancyLabel(gym.currentOccupancy).toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Key Amenities */}
                <div className="space-y-1">
                  <span className="text-xs text-gray-600">Principales Servicios</span>
                  <div className="flex flex-wrap gap-1">
                    {gym.amenities.slice(0, 3).map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-xs px-2 py-0">
                        {amenity}
                      </Badge>
                    ))}
                    {gym.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        +{gym.amenities.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                          <span>{gym.name}</span>
                          <Badge className="bg-blue-600 text-white">
                            ${gym.monthlyPrice}/mes
                          </Badge>
                        </DialogTitle>
                      </DialogHeader>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Ubicación y Contacto</h4>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-start space-x-2">
                                <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                                <div>
                                  <p>{gym.address}</p>
                                  <p>{gym.distance && `${gym.distance} km de distancia`}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <p>{gym.phone}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Horarios</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              {Object.entries(gym.hours).map(([days, hours]) => (
                                <div key={days} className="flex justify-between">
                                  <span>{days}</span>
                                  <span>{hours.open} - {hours.close}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Servicios</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {gym.amenities.map((amenity) => (
                                <div key={amenity} className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                                  <span className="text-sm text-gray-600">{amenity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Valoración y Reseñas</h4>
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="flex items-center space-x-1">
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                <span className="font-medium">{gym.rating}</span>
                              </div>
                              <span className="text-sm text-gray-500">({gym.reviews} reseñas)</span>
                            </div>
                          </div>

                          <OccupancyChart data={gym.occupancyData} gymName={gym.name} />
                        </div>
                      </div>

                      <div className="flex space-x-3 pt-4 border-t">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                          <Phone className="w-4 h-4 mr-2" />
                          Llamar Ahora
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <MapPin className="w-4 h-4 mr-2" />
                          Cómo Llegar
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button size="sm" className="flex-1 text-xs bg-blue-600 hover:bg-blue-700">
                    <Phone className="w-3 h-3 mr-1" />
                    Llamar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add more gyms placeholder */}
          {selectedGyms.length < 3 && (
            <Card className="border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[200px]">
              <div className="text-center p-4">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-1">Añade hasta {3 - selectedGyms.length} gimnasios más</p>
                <p className="text-xs text-gray-400">Haz clic en el botón + de las tarjetas</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}