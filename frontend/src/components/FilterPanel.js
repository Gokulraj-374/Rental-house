import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';

const AMENITIES_LIST = [
  'WiFi', 'AC', 'Gym', 'Swimming Pool', 'Parking',
  'Security', 'Power Backup', 'Lift', 'Garden', 'Balcony'
];

const BHK_OPTIONS = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK'];

export const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  const { t } = useTranslation();
  const [budgetRange, setBudgetRange] = useState([filters.min_price || 5000, filters.max_price || 50000]);

  const handleBudgetChange = (values) => {
    setBudgetRange(values);
    onFilterChange({
      ...filters,
      min_price: values[0],
      max_price: values[1]
    });
  };

  const handleBHKChange = (bhk) => {
    onFilterChange({ ...filters, bhk: bhk === 'all' ? '' : bhk });
  };

  const handleAmenityToggle = (amenity) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    onFilterChange({ ...filters, amenities: newAmenities });
  };

  const handleCityChange = (e) => {
    onFilterChange({ ...filters, city: e.target.value });
  };

  return (
    <Card className="p-6 rounded-2xl space-y-6" data-testid="filter-panel">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-lg">{t('filter.title')}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="rounded-full"
          data-testid="reset-filters-button"
        >
          <X className="w-4 h-4 mr-1" />
          {t('filter.reset')}
        </Button>
      </div>

      {/* City Search */}
      <div className="space-y-2">
        <Label htmlFor="city">City / Area</Label>
        <Input
          id="city"
          placeholder="Enter city or area..."
          value={filters.city || ''}
          onChange={handleCityChange}
          className="rounded-full"
          data-testid="city-filter-input"
        />
      </div>

      {/* Budget Range */}
      <div className="space-y-3">
        <Label>{t('filter.budget')}</Label>
        <div className="px-2">
          <Slider
            min={5000}
            max={100000}
            step={1000}
            value={budgetRange}
            onValueChange={handleBudgetChange}
            className="mb-4"
            data-testid="budget-slider"
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-mono text-primary font-medium">{formatCurrency(budgetRange[0])}</span>
          <span className="text-muted-foreground">to</span>
          <span className="font-mono text-primary font-medium">{formatCurrency(budgetRange[1])}</span>
        </div>
      </div>

      {/* BHK Type */}
      <div className="space-y-2">
        <Label>{t('filter.bhk_type')}</Label>
        <Select value={filters.bhk || 'all'} onValueChange={handleBHKChange}>
          <SelectTrigger className="rounded-full" data-testid="bhk-filter-select">
            <SelectValue placeholder="Select BHK" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {BHK_OPTIONS.map(bhk => (
              <SelectItem key={bhk} value={bhk}>{bhk}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amenities */}
      <div className="space-y-3">
        <Label>{t('filter.amenities')}</Label>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {AMENITIES_LIST.map(amenity => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={(filters.amenities || []).includes(amenity)}
                onCheckedChange={() => handleAmenityToggle(amenity)}
                data-testid={`amenity-checkbox-${amenity.toLowerCase().replace(/\s+/g, '-')}`}
              />
              <label
                htmlFor={amenity}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};