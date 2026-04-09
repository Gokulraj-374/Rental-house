import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PropertyCard } from '@/components/PropertyCard';
import { MapView } from '@/components/MapView';
import { FilterPanel } from '@/components/FilterPanel';
import { Button } from '@/components/ui/button';
import { List, Map, SlidersHorizontal } from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function BrowsePage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' or 'map'
  const [showFilters, setShowFilters] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    min_price: 5000,
    max_price: 50000,
    bhk: '',
    amenities: []
  });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    try {
      const data = await api.getFavorites();
      setFavorites(data.map(p => p.id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...properties];

    if (filters.city) {
      filtered = filtered.filter(p =>
        p.address.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.min_price || filters.max_price) {
      filtered = filtered.filter(p =>
        p.price >= filters.min_price && p.price <= filters.max_price
      );
    }

    if (filters.bhk) {
      filtered = filtered.filter(p => p.bhk === filters.bhk);
    }

    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(p =>
        filters.amenities.some(amenity => p.amenities.includes(amenity))
      );
    }

    setFilteredProperties(filtered);
  }, [properties, filters]);

  useEffect(() => {
    fetchProperties();
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated, fetchProperties, fetchFavorites]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      city: '',
      min_price: 5000,
      max_price: 50000,
      bhk: '',
      amenities: []
    });
  };

  const handleFavorite = async (propertyId) => {
    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      return;
    }

    try {
      if (favorites.includes(propertyId)) {
        await api.removeFavorite(propertyId);
        setFavorites(favorites.filter(id => id !== propertyId));
        toast.success('Removed from favorites');
      } else {
        await api.addFavorite(propertyId);
        setFavorites([...favorites, propertyId]);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight mb-2">
              Browse Properties
            </h1>
            <p className="text-muted-foreground">
              {filteredProperties.length} properties available
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-full lg:hidden"
              data-testid="toggle-filters-button"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
            
            <div className="flex items-center gap-1 bg-muted p-1 rounded-full">
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
                className="rounded-full"
                data-testid="list-view-toggle"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={view === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('map')}
                className="rounded-full"
                data-testid="map-view-toggle"
              >
                <Map className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters Sidebar */}
          {(showFilters || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="lg:sticky lg:top-24">
                <FilterPanel
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                />
              </div>
            </motion.div>
          )}

          {/* Properties List/Map */}
          <div className={showFilters || window.innerWidth >= 1024 ? 'lg:col-span-9' : 'lg:col-span-12'}>
            {view === 'list' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                data-testid="properties-list"
              >
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onFavorite={handleFavorite}
                    isFavorite={favorites.includes(property.id)}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Property List in Map View */}
                <div className="lg:col-span-2 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {filteredProperties.map((property) => (
                    <div
                      key={property.id}
                      onClick={() => setSelectedProperty(property)}
                      className={`cursor-pointer ${
                        selectedProperty?.id === property.id ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <PropertyCard
                        property={property}
                        onFavorite={handleFavorite}
                        isFavorite={favorites.includes(property.id)}
                      />
                    </div>
                  ))}
                </div>

                {/* Map */}
                <div className="lg:col-span-3">
                  <div className="sticky top-24 h-[calc(100vh-200px)]">
                    <MapView
                      properties={filteredProperties}
                      selectedProperty={selectedProperty}
                      onPropertySelect={setSelectedProperty}
                    />
                  </div>
                </div>
              </div>
            )}

            {filteredProperties.length === 0 && (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground mb-4">
                  No properties found matching your filters
                </p>
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  className="rounded-full"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}