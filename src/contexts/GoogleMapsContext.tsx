import React, { createContext, useContext, useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { supabase } from '@/integrations/supabase/client';

const libraries: ("places")[] = ['places'];

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: undefined,
});

export const useGoogleMaps = () => useContext(GoogleMapsContext);

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [keyLoaded, setKeyLoaded] = useState(false);
  
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-google-places-token');
        if (error) throw error;
        setApiKey(data.token || '');
      } catch (error) {
        console.error('Failed to fetch Google API key:', error);
        setApiKey(''); // Set empty string on error
      } finally {
        setKeyLoaded(true);
      }
    };
    fetchApiKey();
  }, []);

  // Wait until we've attempted to load the key
  if (!keyLoaded) {
    return <div>Loading configuration...</div>;
  }

  // Only render the provider with Google Maps if we have a valid key
  if (!apiKey) {
    return (
      <GoogleMapsContext.Provider value={{ isLoaded: false, loadError: new Error('No API key') }}>
        {children}
      </GoogleMapsContext.Provider>
    );
  }

  return <GoogleMapsProviderWithKey apiKey={apiKey}>{children}</GoogleMapsProviderWithKey>;
}

// Separate component that only renders when we have a key
function GoogleMapsProviderWithKey({ apiKey, children }: { apiKey: string; children: React.ReactNode }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: libraries,
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}