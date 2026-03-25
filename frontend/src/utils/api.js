import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const api = {
  // Properties
  getProperties: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (filters.bhk) params.append('bhk', filters.bhk);
    if (filters.amenities) params.append('amenities', filters.amenities.join(','));
    
    const response = await axios.get(`${API}/properties?${params}`);
    return response.data;
  },

  getProperty: async (id) => {
    const response = await axios.get(`${API}/properties/${id}`);
    return response.data;
  },

  createProperty: async (propertyData) => {
    const response = await axios.post(`${API}/properties`, propertyData);
    return response.data;
  },

  // Recommendations
  getRecommendations: async (budget, amenities = []) => {
    const params = new URLSearchParams();
    params.append('budget', budget);
    if (amenities.length > 0) {
      params.append('preferred_amenities', amenities.join(','));
    }
    
    const response = await axios.get(`${API}/recommendations?${params}`);
    return response.data;
  },

  // Favorites
  getFavorites: async () => {
    const response = await axios.get(`${API}/favorites`);
    return response.data;
  },

  addFavorite: async (propertyId) => {
    const response = await axios.post(`${API}/favorites`, { property_id: propertyId });
    return response.data;
  },

  removeFavorite: async (propertyId) => {
    const response = await axios.delete(`${API}/favorites/${propertyId}`);
    return response.data;
  },

  // Search history
  addSearchHistory: async (propertyId) => {
    const response = await axios.post(`${API}/search-history?property_id=${propertyId}`);
    return response.data;
  },

  getSearchHistory: async () => {
    const response = await axios.get(`${API}/search-history`);
    return response.data;
  },

  // Nearby properties
  getNearbyProperties: async () => {
    const response = await axios.get(`${API}/nearby-properties`);
    return response.data;
  },

  // Calculate distance
  calculateDistance: async (origin, destination) => {
    const response = await axios.post(`${API}/calculate-distance`, {
      origin,
      destination
    });
    return response.data;
  },

  // Predict price
  predictPrice: async (location, bhk, amenities, address) => {
    const response = await axios.post(`${API}/predict-price`, {
      location,
      bhk,
      amenities,
      address
    });
    return response.data;
  }
};

export default api;