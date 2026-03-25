import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, MapPin, Sparkles, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, login, register } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [authMode, setAuthMode] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    preferred_city: ''
  });

  useEffect(() => {
    const authParam = searchParams.get('auth');
    if (authParam === 'login' || authParam === 'signup') {
      setAuthMode(authParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const closeAuthDialog = () => {
    setAuthMode(null);
    searchParams.delete('auth');
    setSearchParams(searchParams);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password);
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        await register(formData.email, formData.password, formData.name, formData.preferred_city);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized property suggestions based on your budget and preferences'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Location Intelligence',
      description: 'Find homes near your workplace with travel time calculations'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Price Predictions',
      description: 'AI-powered price estimates to help you make informed decisions'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/17174767/pexels-photo-17174767.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=1920"
            alt="Modern house"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-block mb-4"
              >
                <div className="px-4 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm">
                  <span className="text-sm font-medium text-accent flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI-Powered House Hunting
                  </span>
                </div>
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold tracking-tight mb-4">
                {t('hero.title')}{' '}
                <span className="text-primary">{t('hero.title_accent')}</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('hero.subtitle')}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                size="lg"
                className="rounded-full px-8 btn-hover text-lg h-12"
                onClick={() => setAuthMode('signup')}
                data-testid="hero-get-started-button"
              >
                {t('hero.cta')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 btn-hover text-lg h-12"
                onClick={() => navigate('/browse')}
                data-testid="hero-explore-button"
              >
                {t('hero.explore')}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4">
              Why Choose RentAI?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Smart technology meets perfect home hunting
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="bg-card p-8 rounded-2xl border hover:border-primary/30 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Dialog */}
      <Dialog open={!!authMode} onOpenChange={closeAuthDialog}>
        <DialogContent className="sm:max-w-md" data-testid={`auth-dialog-${authMode}`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading">
              {authMode === 'login' ? t('auth.sign_in') : t('auth.sign_up')}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">{t('auth.name')}</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="rounded-full"
                  data-testid="signup-name-input"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="rounded-full"
                data-testid="auth-email-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="rounded-full"
                data-testid="auth-password-input"
              />
            </div>
            
            {authMode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="city">{t('auth.preferred_city')}</Label>
                <Input
                  id="city"
                  placeholder="Chennai"
                  value={formData.preferred_city}
                  onChange={(e) => setFormData({ ...formData, preferred_city: e.target.value })}
                  className="rounded-full"
                  data-testid="signup-city-input"
                />
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full rounded-full btn-hover"
              disabled={loading}
              data-testid="auth-submit-button"
            >
              {loading ? 'Please wait...' : (authMode === 'login' ? t('auth.sign_in') : t('auth.sign_up'))}
            </Button>
            
            <div className="text-center text-sm">
              {authMode === 'login' ? (
                <>
                  {t('auth.no_account')}{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="text-primary hover:underline font-medium"
                    data-testid="switch-to-signup"
                  >
                    {t('auth.sign_up')}
                  </button>
                </>
              ) : (
                <>
                  {t('auth.have_account')}{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-primary hover:underline font-medium"
                    data-testid="switch-to-login"
                  >
                    {t('auth.sign_in')}
                  </button>
                </>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}