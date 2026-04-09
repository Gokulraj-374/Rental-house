# 🏠 RentAI - AI Rental House Recommendation System

[![Status](https://img.shields.io/badge/status-production--ready-brightgreen)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)](https://www.mongodb.com/)

> AI-powered rental property recommendation platform helping users find their perfect home based on budget, location, and lifestyle preferences across Tamil Nadu.

## 🌟 Features

### Core Features
- 🔐 **User Authentication** - Secure JWT-based signup/login
- 🏘️ **Property Management** - Add, view, and manage rental properties
- 🤖 **AI Recommendations** - Smart property suggestions using ML algorithms (40% budget + 30% distance + 30% amenities)
- 🗺️ **Interactive Maps** - Leaflet integration with custom property markers
- 📊 **Price Prediction** - AI-powered rent estimation
- ⭐ **Reviews & Ratings** - User feedback system
- 💬 **Contact Owners** - Direct messaging to property owners
- 🔔 **Alerts System** - Price drop and new listing notifications
- 📈 **Analytics Dashboard** - Track views, favorites, and user behavior
- 🌙 **Dark Mode** - System-aware theme switching
- 📱 **Mobile Responsive** - Optimized for all devices

### Advanced Filters
- Budget range, BHK type, Amenities
- Furnishing status (Unfurnished/Semi/Fully)
- Pet-friendly properties, Floor preferences

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, Python 3.10+, MongoDB 7.0+

### Installation

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend  
cd frontend
yarn install

# Seed sample data
python scripts/seed_tamilnadu_properties.py
```

### Run
```bash
# Backend: uvicorn server:app --host 0.0.0.0 --port 8001 --reload
# Frontend: yarn start
```

**Live Demo**: https://rental-recommender.preview.emergentagent.com  
**Demo Login**: demo@example.com / password123

## 📖 Documentation
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)

## 🏗️ Tech Stack
- **Frontend**: React 19, Tailwind CSS, Leaflet, Framer Motion
- **Backend**: FastAPI, MongoDB (Motor), JWT, Bcrypt
- **Deployment**: Kubernetes, Nginx, Supervisor

## 📊 Coverage
35+ properties across 15 Tamil Nadu cities (₹6,500 - ₹75,000/month)

## 🎯 AI Algorithm
```
Score = (Price_Match × 0.4) + (Distance × 0.3) + (Amenities × 0.3)
```

## 📝 License
MIT License - See LICENSE file

---
Made with 💙 in Tamil Nadu
