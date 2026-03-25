import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.browse": "Browse",
      "nav.favorites": "Favorites",
      "nav.add_property": "Add Property",
      "nav.profile": "Profile",
      "nav.login": "Login",
      "nav.logout": "Logout",
      
      // Hero
      "hero.title": "Find Your Perfect",
      "hero.title_accent": "Rental Home",
      "hero.subtitle": "AI-powered recommendations based on your budget, location, and lifestyle",
      "hero.cta": "Get Started",
      "hero.explore": "Explore Properties",
      
      // Auth
      "auth.sign_up": "Sign Up",
      "auth.sign_in": "Sign In",
      "auth.email": "Email",
      "auth.password": "Password",
      "auth.name": "Full Name",
      "auth.preferred_city": "Preferred City",
      "auth.no_account": "Don't have an account?",
      "auth.have_account": "Already have an account?",
      
      // Dashboard
      "dashboard.recommended": "Recommended for You",
      "dashboard.nearby": "Nearby Properties",
      "dashboard.recent": "Recently Viewed",
      "dashboard.welcome": "Welcome back",
      
      // Property
      "property.bhk": "BHK",
      "property.per_month": "per month",
      "property.amenities": "Amenities",
      "property.location": "Location",
      "property.distance": "km away",
      "property.travel_time": "min",
      "property.ai_score": "AI Match",
      "property.best_match": "Best Match",
      "property.view_details": "View Details",
      "property.save": "Save",
      "property.saved": "Saved",
      
      // Filters
      "filter.title": "Filters",
      "filter.budget": "Budget Range",
      "filter.bhk_type": "BHK Type",
      "filter.amenities": "Amenities",
      "filter.apply": "Apply Filters",
      "filter.reset": "Reset",
      
      // Common
      "common.loading": "Loading...",
      "common.error": "Something went wrong",
      "common.search": "Search",
      "common.close": "Close",
      "common.save": "Save",
      "common.cancel": "Cancel"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;