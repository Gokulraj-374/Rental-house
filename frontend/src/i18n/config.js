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
  },
  ta: {
    translation: {
      // Navigation
      "nav.home": "முகப்பு",
      "nav.browse": "உலாவு",
      "nav.favorites": "விருப்பங்கள்",
      "nav.add_property": "சொத்து சேர்",
      "nav.profile": "சுயவிவரம்",
      "nav.login": "உள்நுழை",
      "nav.logout": "வெளியேறு",
      
      // Hero
      "hero.title": "உங்கள் சிறந்த",
      "hero.title_accent": "வாடகை வீட்டைக் கண்டறியுங்கள்",
      "hero.subtitle": "உங்கள் பட்ஜெட், இருப்பிடம் மற்றும் வாழ்க்கை முறையின் அடிப்படையில் AI-இயங்கும் பரிந்துரைகள்",
      "hero.cta": "தொடங்கு",
      "hero.explore": "சொத்துகளை ஆராயுங்கள்",
      
      // Auth
      "auth.sign_up": "பதிவு செய்",
      "auth.sign_in": "உள்நுழை",
      "auth.email": "மின்னஞ்சல்",
      "auth.password": "கடவுச்சொல்",
      "auth.name": "முழு பெயர்",
      "auth.preferred_city": "விருப்ப நகரம்",
      "auth.no_account": "கணக்கு இல்லையா?",
      "auth.have_account": "ஏற்கனவே கணக்கு உள்ளதா?",
      
      // Dashboard
      "dashboard.recommended": "உங்களுக்காக பரிந்துரைக்கப்பட்டது",
      "dashboard.nearby": "அருகிலுள்ள சொத்துகள்",
      "dashboard.recent": "சமீபத்தில் பார்த்தவை",
      "dashboard.welcome": "மீண்டும் வருக",
      
      // Property
      "property.bhk": "BHK",
      "property.per_month": "மாதம்",
      "property.amenities": "வசதிகள்",
      "property.location": "இடம்",
      "property.distance": "கி.மீ தூரம்",
      "property.travel_time": "நிமிடம்",
      "property.ai_score": "AI பொருத்தம்",
      "property.best_match": "சிறந்த பொருத்தம்",
      "property.view_details": "விவரங்களைக் காண்க",
      "property.save": "சேமி",
      "property.saved": "சேமிக்கப்பட்டது",
      
      // Filters
      "filter.title": "வடிப்பான்கள்",
      "filter.budget": "பட்ஜெட் வரம்பு",
      "filter.bhk_type": "BHK வகை",
      "filter.amenities": "வசதிகள்",
      "filter.apply": "வடிப்பான்களைப் பயன்படுத்து",
      "filter.reset": "மீட்டமை",
      
      // Common
      "common.loading": "ஏற்றுகிறது...",
      "common.error": "ஏதோ தவறு ஏற்பட்டது",
      "common.search": "தேடு",
      "common.close": "மூடு",
      "common.save": "சேமி",
      "common.cancel": "ரத்து செய்"
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