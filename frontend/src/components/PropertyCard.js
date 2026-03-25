import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDistance, formatTime, getAIScoreColor } from '@/utils/helpers';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PropertyCard = ({ property, aiScore, distance, travelTime, onFavorite, isFavorite, showAIBadge = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/property/${property.id}`);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    onFavorite?.(property.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      data-testid={`property-card-${property.id}`}
    >
      <Card className="property-card overflow-hidden rounded-2xl border cursor-pointer group" onClick={handleClick}>
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* AI Badge */}
          {showAIBadge && aiScore && aiScore >= 70 && (
            <div className="absolute top-3 left-3">
              <Badge className="ai-badge-shimmer text-white border-none px-3 py-1 gap-1" data-testid={`ai-badge-${property.id}`}>
                <Sparkles className="w-3 h-3" />
                {t('property.best_match')}
              </Badge>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
            data-testid={`favorite-button-${property.id}`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title & Price */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-1 line-clamp-1" data-testid={`property-title-${property.id}`}>
              {property.title}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-primary" data-testid={`property-price-${property.id}`}>
                {formatCurrency(property.price)}
              </span>
              <span className="text-sm text-muted-foreground">/{t('property.per_month')}</span>
            </div>
          </div>

          {/* BHK & Location */}
          <div className="space-y-2">
            <Badge variant="secondary" className="rounded-full">
              {property.bhk}
            </Badge>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{property.address}</span>
            </div>
          </div>

          {/* Distance & Travel Time */}
          {(distance !== undefined || travelTime !== undefined) && (
            <div className="flex items-center gap-3">
              {distance !== undefined && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 rounded-full" data-testid={`distance-${property.id}`}>
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-mono font-medium text-primary">
                    {formatDistance(distance)}
                  </span>
                </div>
              )}
              {travelTime !== undefined && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-secondary/10 rounded-full" data-testid={`travel-time-${property.id}`}>
                  <Clock className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-xs font-mono font-medium text-secondary">
                    {formatTime(travelTime)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* AI Score */}
          {aiScore !== undefined && (
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">{t('property.ai_score')}</span>
              <span className={`font-mono text-lg font-bold ${getAIScoreColor(aiScore)}`} data-testid={`ai-score-${property.id}`}>
                {aiScore}%
              </span>
            </div>
          )}

          {/* Amenities */}
          <div className="flex flex-wrap gap-2">
            {property.amenities?.slice(0, 3).map((amenity, idx) => (
              <Badge key={idx} variant="outline" className="rounded-full text-xs">
                {amenity}
              </Badge>
            ))}
            {property.amenities?.length > 3 && (
              <Badge variant="outline" className="rounded-full text-xs">
                +{property.amenities.length - 3}
              </Badge>
            )}
          </div>

          {/* View Details Button */}
          <Button
            className="w-full rounded-full btn-hover"
            variant="outline"
            onClick={handleClick}
            data-testid={`view-details-${property.id}`}
          >
            {t('property.view_details')}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};