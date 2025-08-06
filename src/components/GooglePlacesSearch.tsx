import React, { useState, useCallback } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useGoogleMaps } from '@/contexts/GoogleMapsContext';

interface GooglePlacesSearchProps {
  onAddressSelect: (address: string, coordinates: [number, number]) => void;
  className?: string;
}

export const GooglePlacesSearch: React.FC<GooglePlacesSearchProps> = ({
  onAddressSelect,
  className = ""
}) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const { isLoaded, loadError } = useGoogleMaps();

  console.log('GooglePlacesSearch: Rendering - isLoaded:', isLoaded);

  const onLoad = useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
    console.log('GooglePlacesSearch: Autocomplete loaded');
    setAutocomplete(autocompleteInstance);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      console.log('GooglePlacesSearch: Place selected:', place?.formatted_address);
      
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name || '';
        
        onAddressSelect(address, [lng, lat]);
        
        toast({
          title: "Address Selected",
          description: `Flying to ${address}`,
        });
      }
    }
  }, [autocomplete, onAddressSelect]);

  if (loadError) {
    return (
      <Card className="p-4">
        <p className="text-destructive">Error loading Google Maps: {loadError.message}</p>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading Maps API...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
            options={{
              types: ['address'],
              componentRestrictions: { country: 'US' }
            }}
          >
            <Input
              placeholder="Enter property address..."
              className="pl-10"
            />
          </Autocomplete>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};