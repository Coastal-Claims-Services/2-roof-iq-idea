import React, { createContext, useContext, useEffect, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { supabase } from '@/integrations/supabase/client';

const libraries: ("places")[] = ["places"];

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
  isLoadingKey: boolean;
  hasValidKey: boolean;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: undefined,
  isLoadingKey: true,
  hasValidKey: false,
});

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
  const [googleApiKey, setGoogleApiKey] = useState<string>('');
  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [hasValidKey, setHasValidKey] = useState(false);

  // Fetch Google Places API key from Supabase
  useEffect(() => {
    const fetchGoogleKey = async () => {
      console.log('GoogleMapsProvider: Fetching Google API key');
      try {
        const { data, error } = await supabase.functions.invoke('get-google-places-token');
        
        if (error) {
          console.error('GoogleMapsProvider: Error fetching Google Places token:', error);
          setHasValidKey(false);
          return;
        }

        if (data?.token && data.token.startsWith('AIza')) {
          console.log('GoogleMapsProvider: Valid Google API key detected');
          setGoogleApiKey(data.token);
          setHasValidKey(true);
        } else {
          console.warn('GoogleMapsProvider: Invalid or missing Google Places API key');
          setHasValidKey(false);
        }
      } catch (error) {
        console.error('GoogleMapsProvider: Error:', error);
        setHasValidKey(false);
      } finally {
        setIsLoadingKey(false);
      }
    };

    fetchGoogleKey();
  }, []);

  // Only load Google Maps API if we have a valid key
  const shouldLoadApi = hasValidKey && googleApiKey && !isLoadingKey;
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: shouldLoadApi ? googleApiKey : '',
    libraries: shouldLoadApi ? libraries : undefined,
  });

  console.log('GoogleMapsProvider: Status - isLoadingKey:', isLoadingKey, 'hasValidKey:', hasValidKey, 'shouldLoadApi:', shouldLoadApi, 'isLoaded:', isLoaded);

  return (
    <GoogleMapsContext.Provider value={{
      isLoaded: shouldLoadApi ? isLoaded : false,
      loadError,
      isLoadingKey,
      hasValidKey,
    }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};