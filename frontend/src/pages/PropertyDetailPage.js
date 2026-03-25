import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapView } from '@/components/MapView';
import { Heart, MapPin, Clock, Sparkles, ArrowLeft, Share2 } from 'lucide-react';
import { formatCurrency, formatDistance, formatTime } from '@/utils/helpers';
import api from '@/utils/api';
import { toast } from 'sonner';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [property, setProperty] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchPropertyDetails();
    if (isAuthenticated) {
      addToSearchHistory();
      checkFavoriteStatus();
    }
  }, [id, isAuthenticated]);

  const fetchPropertyDetails = async () => {
    setLoading(true);
    try {
      const data = await api.getProperty(id);
      setProperty(data);

      // Fetch price prediction
      const predictionData = await api.predictPrice(
        data.location,
        data.bhk,
        data.amenities,
        data.address
      );
      setPrediction(predictionData);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const addToSearchHistory = async () => {
    try {
      await api.addSearchHistory(id);
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const favorites = await api.getFavorites();
      setIsFavorite(favorites.some(p => p.id === id));
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      return;
    }

    try {
      if (isFavorite) {
        await api.removeFavorite(id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await api.addFavorite(id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
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

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Property not found</p>
          <Button onClick={() => navigate('/browse')} className="mt-4 rounded-full">
            Browse Properties
          </Button>
        </div>
      </div>
    );
  }

  const isPriceGood = prediction && property.price < prediction.predicted_price;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 rounded-full"
          data-testid="back-button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <img
                  src={property.images?.[activeImage] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {property.images && property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {property.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === idx ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={image} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Property Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 rounded-2xl space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2" data-testid="property-detail-title">
                        {property.title}
                      </h1>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{property.address}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-base px-4 py-2 rounded-full">
                      {property.bhk}
                    </Badge>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-mono font-bold text-primary" data-testid="property-detail-price">
                      {formatCurrency(property.price)}
                    </span>
                    <span className="text-muted-foreground">/{t('property.per_month')}</span>
                  </div>

                  {/* Price Prediction */}
                  {prediction && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">AI Predicted Price</p>
                          <p className="font-mono font-bold text-lg">
                            {formatCurrency(prediction.predicted_price)}
                          </p>
                        </div>
                        {isPriceGood && (
                          <Badge className="bg-accent text-white" data-testid="great-deal-badge">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Great Deal!
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {property.description && (
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {property.description}
                    </p>
                  </div>
                )}

                {/* Amenities */}
                <div>
                  <h3 className="font-heading font-bold text-lg mb-3">{t('property.amenities')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities?.map((amenity, idx) => (
                      <Badge key={idx} variant="outline" className="rounded-full px-4 py-2">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 rounded-2xl">
                <h3 className="font-heading font-bold text-lg mb-4">{t('property.location')}</h3>
                <div className="h-96">
                  <MapView
                    properties={[property]}
                    center={[property.location?.lat || 13.0827, property.location?.lng || 80.2707]}
                  />
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <Card className="p-6 rounded-2xl space-y-4">
                <Button
                  className="w-full rounded-full btn-hover h-12 text-lg"
                  onClick={handleFavorite}
                  variant={isFavorite ? 'outline' : 'default'}
                  data-testid="favorite-detail-button"
                >
                  <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorite ? t('property.saved') : t('property.save')}
                </Button>

                <Button
                  className="w-full rounded-full btn-hover"
                  variant="outline"
                  onClick={handleShare}
                  data-testid="share-button"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Property ID</span>
                    <span className="text-sm font-mono">{property.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">BHK Type</span>
                    <span className="text-sm font-medium">{property.bhk}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amenities</span>
                    <span className="text-sm font-medium">{property.amenities?.length || 0}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}