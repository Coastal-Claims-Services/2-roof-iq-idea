
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Loader2 } from "lucide-react";
import { geocodingService, GeocodeResult } from '@/services/geocoding';
import { toast } from "sonner";

interface AddressSearchProps {
  onAddressSelect: (result: GeocodeResult) => void;
  placeholder?: string;
  className?: string;
}

export const AddressSearch: React.FC<AddressSearchProps> = ({
  onAddressSelect,
  placeholder = "Enter property address...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const searchResults = await geocodingService.searchAddress(query);
      setResults(searchResults);
      setShowResults(true);
    } catch (error) {
      console.error('Address search failed:', error);
      toast.error("Failed to search address. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectAddress = (result: GeocodeResult) => {
    setQuery(result.formatted_address);
    setShowResults(false);
    onAddressSelect(result);
    toast.success("Address selected successfully!");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="font-medium">Property Address</span>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            size="sm"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>
      </Card>

      {showResults && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-2 bg-card border shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                onClick={() => handleSelectAddress(result)}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{result.formatted_address}</p>
                  <p className="text-xs text-muted-foreground">
                    {result.coordinates[1].toFixed(6)}, {result.coordinates[0].toFixed(6)}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {Math.round(result.confidence * 100)}% match
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
