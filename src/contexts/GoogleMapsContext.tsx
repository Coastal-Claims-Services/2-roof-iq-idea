import React, { createContext, useContext, useEffect, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { supabase } from '@/integrations/supabase/client';

// Define libraries outside component to maintain stable reference
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

// Separate component for Google Maps loading to prevent re-initialization
const GoogleMapsLoader: React.FC<{ 
  apiKey: string;
  children: React.ReactNode;
  onStatusChange: (isLoaded: boolean, loadError: Error | undefined) => void;
}> = ({ apiKey, children, onStatusChange }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: libraries, // Stable reference
  });

  useEffect(() => {
    onStatusChange(isLoaded, loadError);
  }, [isLoaded, loadError, onStatusChange]);

  return <>{children}</>;
};

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
  const [googleApiKey, setGoogleApiKey] = useState<string>('');
  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [hasValidKey, setHasValidKey] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsLoadError, setMapsLoadError] = useState<Error | undefined>();

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

  const handleMapsStatusChange = React.useCallback((isLoaded: boolean, loadError: Error | undefined) => {
    setMapsLoaded(isLoaded);
    setMapsLoadError(loadError);
  }, []);

  console.log('GoogleMapsProvider: Status - isLoadingKey:', isLoadingKey, 'hasValidKey:', hasValidKey, 'mapsLoaded:', mapsLoaded);

  const contextValue = {
    isLoaded: hasValidKey && mapsLoaded,
    loadError: mapsLoadError,
    isLoadingKey,
    hasValidKey,
  };

  // Only render GoogleMapsLoader when we have a valid API key
  if (hasValidKey && googleApiKey && !isLoadingKey) {
    return (
      <GoogleMapsLoader 
        apiKey={googleApiKey} 
        onStatusChange={handleMapsStatusChange}
      >
        <GoogleMapsContext.Provider value={contextValue}>
          {children}
        </GoogleMapsContext.Provider>
      </GoogleMapsLoader>
    );
  }

  // Render without Google Maps loader when key is not available
  return (
    <GoogleMapsContext.Provider value={contextValue}>
      {children}
    </GoogleMapsContext.Provider>
  );
};