# API Documentation

Base URL: `https://rental-recommender.preview.emergentagent.com/api`

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### Register
**POST** `/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "preferred_city": "Chennai",
  "workplace_location": {
    "lat": 13.0827,
    "lng": 80.2707,
    "address": "T. Nagar, Chennai"
  }
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Login
**POST** `/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## Properties

### Get All Properties
**GET** `/properties?city=Chennai&min_price=10000&max_price=20000&bhk=2BHK&amenities=WiFi,AC&furnishing=Semi-Furnished&pet_friendly=true`

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Modern 2BHK Apartment",
    "price": 18000,
    "location": {"lat": 13.0827, "lng": 80.2707},
    "address": "T. Nagar, Chennai",
    "bhk": "2BHK",
    "amenities": ["WiFi", "AC", "Parking"],
    "images": ["url1", "url2"],
    "furnishing": "Semi-Furnished",
    "pet_friendly": false,
    "view_count": 45,
    "avg_rating": 4.5,
    "review_count": 12
  }
]
```

### Get Property Details
**GET** `/properties/{property_id}` 🔓 Public

### Create Property
**POST** `/properties` 🔒 Protected

**Request:**
```json
{
  "title": "Spacious 3BHK Villa",
  "price": 35000,
  "location": {"lat": 13.0827, "lng": 80.2707},
  "address": "Anna Nagar, Chennai",
  "bhk": "3BHK",
  "amenities": ["WiFi", "AC", "Gym", "Pool"],
  "images": ["url1"],
  "description": "Luxury villa...",
  "furnishing": "Fully-Furnished",
  "pet_friendly": true,
  "floor_number": 2,
  "total_floors": 5
}
```

## AI Features

### Get Recommendations
**GET** `/recommendations?budget=15000&preferred_amenities=WiFi,Gym` 🔒 Protected

**Response:**
```json
[
  {
    "property": { /* property object */ },
    "ai_score": 87.5,
    "distance_km": 3.2,
    "travel_time_minutes": 15,
    "price_match_score": 92.0,
    "distance_score": 85.0,
    "amenities_score": 80.0
  }
]
```

### Predict Price
**POST** `/predict-price`

**Request:**
```json
{
  "location": {"lat": 13.0827, "lng": 80.2707},
  "bhk": "2BHK",
  "amenities": ["WiFi", "AC"],
  "address": "Chennai"
}
```

**Response:**
```json
{
  "predicted_price": 16500.0,
  "confidence": "Medium"
}
```

### Calculate Distance
**POST** `/calculate-distance`

**Request:**
```json
{
  "origin": {"lat": 13.0827, "lng": 80.2707},
  "destination": {"lat": 13.0418, "lng": 80.2341}
}
```

**Response:**
```json
{
  "distance_km": 5.2,
  "travel_time_minutes": 18
}
```

## Reviews

### Create Review
**POST** `/reviews` 🔒 Protected

**Request:**
```json
{
  "property_id": "uuid",
  "rating": 5,
  "comment": "Excellent property!"
}
```

### Get Reviews
**GET** `/reviews/{property_id}` 🔓 Public

## Contact & Alerts

### Contact Owner
**POST** `/contact-owner` 🔒 Protected

**Request:**
```json
{
  "property_id": "uuid",
  "message": "Interested in viewing this property"
}
```

### Get My Contacts (as Owner)
**GET** `/contacts` 🔒 Protected

### Create Alert
**POST** `/alerts` 🔒 Protected

**Request:**
```json
{
  "alert_type": "price_drop",
  "criteria": {
    "city": "Chennai",
    "max_price": 20000,
    "bhk": "2BHK"
  }
}
```

### Get Alerts
**GET** `/alerts` 🔒 Protected

### Delete Alert
**DELETE** `/alerts/{alert_id}` 🔒 Protected

## Favorites

### Add Favorite
**POST** `/favorites` 🔒 Protected

**Request:**
```json
{
  "property_id": "uuid"
}
```

### Get Favorites
**GET** `/favorites` 🔒 Protected

### Remove Favorite
**DELETE** `/favorites/{property_id}` 🔒 Protected

## History

### Add to Search History
**POST** `/search-history?property_id=uuid` 🔒 Protected

### Get Search History
**GET** `/search-history` 🔒 Protected

### Get Nearby Properties
**GET** `/nearby-properties` 🔒 Protected

## Analytics

### Get Analytics Dashboard
**GET** `/analytics/dashboard` 🔒 Protected

**Response:**
```json
{
  "total_users": 150,
  "total_properties": 35,
  "total_views": 1250,
  "total_favorites": 85,
  "popular_properties": [ /* top 10 */ ],
  "recent_activities": [ /* last 20 events */ ]
}
```

## Error Responses

```json
{
  "detail": "Error message"
}
```

**Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Rate Limits
No rate limits currently implemented.

## Pagination
Results are limited:
- Properties: 100 max
- Recommendations: 20 max
- Favorites: 50 max
- Reviews: 50 max
