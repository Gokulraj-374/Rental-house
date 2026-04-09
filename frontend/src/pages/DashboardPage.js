import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PropertyCard } from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, MapPin, Clock } from 'lucide-react';
import api from '@/utils/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState([]);
  const [nearby, setNearby] = useState([]);
  const [recent, setRecent] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [recommendedData, nearbyData, recentData, favoritesData] = await Promise.all([
        api.getRecommendations(15000, []),
        api.getNearbyProperties(),
        api.getSearchHistory(),
        api.getFavorites()
      ]);

      setRecommended(recommendedData.slice(0, 6));
      setNearby(nearbyData.slice(0, 6));
      setRecent(recentData.slice(0, 6));
      setFavorites(favoritesData.map(p => p.id));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleFavorite = async (propertyId) => {
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

  const stats = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      label: 'AI Recommendations',
      value: recommended.length,
      color: 'text-accent'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Nearby Properties',
      value: nearby.length,
      color: 'text-primary'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Recently Viewed',
      value: recent.length,
      color: 'text-secondary'
    }
  ];

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
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight mb-2">
            {t('dashboard.welcome')}, {user?.name}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Here are your personalized property recommendations
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stats.indexOf(stat) * 0.1 }}
            >
              <Card className="p-6 rounded-2xl border-2 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-${stat.color}/10 flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-mono font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recommended Properties */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
          data-testid="recommended-section"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                {t('dashboard.recommended')}
              </h2>
            </div>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => navigate('/browse')}
              data-testid="view-all-recommended"
            >
              View All
            </Button>
          </div>
          
          {recommended.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((item) => (
                <PropertyCard
                  key={item.property.id}
                  property={item.property}
                  aiScore={item.ai_score}
                  distance={item.distance_km}
                  travelTime={item.travel_time_minutes}
                  onFavorite={handleFavorite}
                  isFavorite={favorites.includes(item.property.id)}
                  showAIBadge={true}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center rounded-2xl">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No recommendations yet. Update your preferences!</p>
            </Card>
          )}
        </motion.section>

        {/* Nearby Properties */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
          data-testid="nearby-section"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                {t('dashboard.nearby')}
              </h2>
            </div>
          </div>
          
          {nearby.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearby.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onFavorite={handleFavorite}
                  isFavorite={favorites.includes(property.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center rounded-2xl">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No nearby properties found</p>
            </Card>
          )}
        </motion.section>

        {/* Recently Viewed */}
        {recent.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            data-testid="recent-section"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                {t('dashboard.recent')}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recent.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onFavorite={handleFavorite}
                  isFavorite={favorites.includes(property.id)}
                />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}