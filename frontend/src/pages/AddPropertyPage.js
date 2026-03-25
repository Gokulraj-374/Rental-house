import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';

const AMENITIES_LIST = [
  'WiFi', 'AC', 'Gym', 'Swimming Pool', 'Parking',
  'Security', 'Power Backup', 'Lift', 'Garden', 'Balcony'
];

const BHK_OPTIONS = ['1RK', '1BHK', '2BHK', '3BHK', '4BHK', '5BHK'];

export default function AddPropertyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    address: '',
    bhk: '',
    description: '',
    location: { lat: 13.0827, lng: 80.2707 },
    amenities: [],
    images: []
  });
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        location: {
          lat: parseFloat(formData.location.lat),
          lng: parseFloat(formData.location.lng)
        }
      };

      await api.createProperty(propertyData);
      toast.success('Property added successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error(error.response?.data?.detail || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const addImage = () => {
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
      setImageUrl('');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight mb-2">
              {t('nav.add_property')}
            </h1>
            <p className="text-lg text-muted-foreground">
              List your property for rent
            </p>
          </div>

          <Card className="p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Spacious 2BHK in City Center"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="rounded-full"
                  data-testid="property-title-input"
                />
              </div>

              {/* Price & BHK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Monthly Rent (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="15000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="rounded-full"
                    data-testid="property-price-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bhk">BHK Type *</Label>
                  <Select value={formData.bhk} onValueChange={(value) => setFormData({ ...formData, bhk: value })}>
                    <SelectTrigger className="rounded-full" data-testid="property-bhk-select">
                      <SelectValue placeholder="Select BHK" />
                    </SelectTrigger>
                    <SelectContent>
                      {BHK_OPTIONS.map(bhk => (
                        <SelectItem key={bhk} value={bhk}>{bhk}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Full Address *</Label>
                <Input
                  id="address"
                  placeholder="Street, Area, City, Pincode"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="rounded-full"
                  data-testid="property-address-input"
                />
              </div>

              {/* Location Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude *</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    placeholder="13.0827"
                    value={formData.location.lat}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, lat: e.target.value }
                    })}
                    required
                    className="rounded-full"
                    data-testid="property-lat-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude *</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    placeholder="80.2707"
                    value={formData.location.lng}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: { ...formData.location, lng: e.target.value }
                    })}
                    required
                    className="rounded-full"
                    data-testid="property-lng-input"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="rounded-2xl"
                  data-testid="property-description-input"
                />
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AMENITIES_LIST.map(amenity => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`add-${amenity}`}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                        data-testid={`add-amenity-${amenity.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <label
                        htmlFor={`add-${amenity}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="space-y-3">
                <Label>Property Images</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="rounded-full"
                    data-testid="image-url-input"
                  />
                  <Button
                    type="button"
                    onClick={addImage}
                    variant="outline"
                    className="rounded-full"
                    data-testid="add-image-button"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Property ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 rounded-full btn-hover"
                  disabled={loading}
                  data-testid="submit-property-button"
                >
                  {loading ? 'Adding Property...' : 'Add Property'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="rounded-full"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}