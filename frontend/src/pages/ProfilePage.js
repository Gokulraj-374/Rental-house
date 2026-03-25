import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { User, Mail, MapPin } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold tracking-tight mb-2">
              {t('nav.profile')}
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your account information
            </p>
          </div>

          <Card className="p-8 rounded-2xl space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>

              {/* Preferred City */}
              {user?.preferred_city && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Preferred City</p>
                    <p className="font-medium">{user.preferred_city}</p>
                  </div>
                </div>
              )}

              {/* Workplace Location */}
              {user?.workplace_location && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Workplace Location</p>
                    <p className="font-medium">{user.workplace_location.address || `${user.workplace_location.lat}, ${user.workplace_location.lng}`}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}