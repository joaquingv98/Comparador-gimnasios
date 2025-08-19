"use client";

import { MapPin, DollarSign, Star, Users, Filter as FilterIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { FilterState } from "@/types/gym";

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultCount: number;
}

const amenityOptions = [
  "WiFi Gratis",
  "Aparcamiento",
  "Acceso 24/7",
  "Entrenamiento Personal",
  "Clases Grupales",
  "Piscina",
  "Sauna",
  "Vestuarios",
  "Guardería",
  "Cafetería",
];

export default function FilterSidebar({
  filters,
  onFiltersChange,
  resultCount,
}: FilterSidebarProps) {
  // Recibe number[] del Slider y lo convierte en tupla [min,max]
  const handlePriceChange = (value: number[]) => {
    const min = Number(value[0] ?? filters.priceRange[0]);
    const max = Number(value[1] ?? filters.priceRange[1]);
    onFiltersChange({ ...filters, priceRange: [min, max] as [number, number] });
  };

  const handleRatingChange = (value: number[]) => {
    onFiltersChange({ ...filters, rating: Number(value[0] ?? 0) });
  };

  const handleDistanceChange = (value: number[]) => {
    onFiltersChange({ ...filters, distance: Number(value[0] ?? 1) });
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const newAmenities = checked
      ? [...filters.amenities, amenity]
      : filters.amenities.filter((a) => a !== amenity);
    onFiltersChange({ ...filters, amenities: newAmenities });
  };

  const clearFilters = () => {
    onFiltersChange({
      priceRange: [0, 150],
      rating: 0,
      distance: 25,
      amenities: [],
      sortBy: "distance",
    });
  };

  const hasActiveFilters =
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 150 ||
    filters.rating > 0 ||
    filters.distance < 25 ||
    filters.amenities.length > 0;

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FilterIcon className="w-5 h-5" />
            <span>Filtros</span>
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700"
            >
              Limpiar todo
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-500">{resultCount} gimnasios encontrados</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-600" />
            <Label className="font-medium">Precio Mensual</Label>
          </div>
          <div className="px-1">
            <Slider
              value={filters.priceRange as [number, number]}
              onValueChange={handlePriceChange}
              min={0}
              max={150}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}+</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Minimum Rating */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-gray-600" />
            <Label className="font-medium">Valoración Mínima</Label>
          </div>
          <div className="px-1">
            <Slider
              value={[filters.rating]}
              onValueChange={handleRatingChange}
              min={0}
              max={5}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Cualquiera</span>
              <span>{filters.rating}+ estrellas</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Distance */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <Label className="font-medium">Distancia</Label>
          </div>
          <div className="px-1">
            <Slider
              value={[filters.distance]}
              onValueChange={handleDistanceChange}
              min={1}
              max={25}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>1 mi</span>
              <span>{filters.distance}+ mi</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Amenities */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-600" />
            <Label className="font-medium">Servicios</Label>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {amenityOptions.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={(checked) =>
                    handleAmenityChange(amenity, Boolean(checked))
                  }
                />
                <Label
                  htmlFor={`amenity-${amenity}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
