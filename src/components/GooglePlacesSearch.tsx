import React, { useState, useCallback } from 'react';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface GooglePlacesSearchProps {
  onAddressSelect: (address: string, coordinates: [number, number]) => void;
  className?: string;
}

const libraries: ("places")[] = ["places"];

export const GooglePlacesSearch: React.FC<GooglePlacesSearchProps> = ({
  onAddressSelect,
  className = ""
}) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isLoadingKey, setIsLoadingKey] = useState(false);
  const [googleApiKey, setGoogleApiKey] = useState<string>('');

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleApiKey,
    libraries
  });

  // Fetch Google Places API key from Supabase
  React.useEffect(() => {
    const fetchGoogleKey = async () => {
      setIsLoadingKey(true);
      try {
        const { data, error } = await supabase.functions.invoke('get-google-places-token');
        
        if (error) {
          console.error('Error fetching Google Places token:', error);
          toast({
            title: "Configuration Required",
            description: "Google Places API key not configured. Using fallback address search.",
            variant: "destructive"
          });
          return;
        }

        if (data?.token) {
          setGoogleApiKey(data.token);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load Google Places API",
          variant: "destructive"
        });
      } finally {
        setIsLoadingKey(false);
      }
    };

    fetchGoogleKey();
  }, []);

  const onLoad = useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      
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
        <p className="text-destructive">Error loading Google Maps</p>
      </Card>
    );
  }

  if (isLoadingKey) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading Google Places API...</span>
        </div>
      </Card>
    );
  }

  if (!googleApiKey) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 text-warning">
          <MapPin className="h-4 w-4" />
          <span>Google Places API key required for address search</span>
        </div>
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