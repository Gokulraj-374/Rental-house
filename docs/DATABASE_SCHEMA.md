# Database Schema

## Collections Overview

### users
Stores user account information and preferences.

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "password_hash": "$2b$12$...",
  "name": "John Doe",
  "preferred_city": "Chennai",
  "workplace_location": {
    "lat": 13.0827,
    "lng": 80.2707,
    "address": "T. Nagar, Chennai"
  },
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Indexes:**
- `email` (unique)
- `id` (unique)

---

### properties
Rental property listings with all details.

```json
{
  "id": "uuid",
  "title": "Modern 2BHK Apartment",
  "price": 18000,
  "location": {
    "lat": 13.0827,
    "lng": 80.2707
  },
  "address": "T. Nagar, Chennai, Tamil Nadu 600017",
  "bhk": "2BHK",
  "amenities": ["WiFi", "AC", "Parking", "Security"],
  "images": ["https://...", "https://..."],
  "owner_id": "user_uuid",
  "description": "Beautiful apartment...",
  "furnishing": "Semi-Furnished",
  "pet_friendly": false,
  "floor_number": 3,
  "total_floors": 5,
  "available_from": "2024-02-01",
  "created_at": "2024-01-15T10:30:00Z",
  "view_count": 45,
  "avg_rating": 4.5,
  "review_count": 12
}
```

**Indexes:**
- `id` (unique)
- `owner_id`
- `address` (text index for search)
- `price`
- `bhk`

---

### favorites
User saved properties.

```json
{
  "id": "uuid",
  "user_id": "user_uuid",
  "property_id": "property_uuid",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Indexes:**
- `user_id`
- `property_id`
- Compound: `[user_id, property_id]` (unique)

---

### reviews
Property reviews and ratings.

```json
{
  "id": "uuid",
  "property_id": "property_uuid",
  "user_id": "user_uuid",
  "user_name": "John Doe",
  "rating": 5,
  "comment": "Excellent property!",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Indexes:**
- `property_id`
- `user_id`
- Compound: `[user_id, property_id]` (unique)

---

### contacts
Owner contact inquiries.

```json
{
  "id": "uuid",
  "property_id": "property_uuid",
  "user_id": "user_uuid",
  "user_name": "John Doe",
  "user_email": "user@example.com",
  "message": "Interested in viewing...",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Indexes:**
- `property_id`
- `user_id`
- `status`

---

### alerts
User notification preferences.

```json
{
  "id": "uuid",
  "user_id": "user_uuid",
  "alert_type": "price_drop",
  "criteria": {
    "city": "Chennai",
    "max_price": 20000,
    "bhk": "2BHK",
    "amenities": ["WiFi"]
  },
  "active": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Indexes:**
- `user_id`
- `active`

---

### search_history
User browsing history.

```json
{
  "id": "uuid",
  "user_id": "user_uuid",
  "property_id": "property_uuid",
  "viewed_at": "2024-01-15T10:30:00Z"
}
```

**Indexes:**
- `user_id`
- `viewed_at` (descending)

---

### analytics
Event tracking and metrics.

```json
{
  "id": "uuid",
  "event_type": "property_view",
  "user_id": "user_uuid",
  "property_id": "property_uuid",
  "metadata": {
    "source": "dashboard",
    "filters": {...}
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Event Types:**
- `user_register`
- `user_login`
- `property_created`
- `property_view`
- `properties_search`
- `recommendations_generated`
- `favorite_added`
- `favorite_removed`
- `review_created`
- `contact_owner`
- `alert_created`

**Indexes:**
- `event_type`
- `user_id`
- `property_id`
- `timestamp` (descending)

---

## Relationships

```
users (1) ──── (N) properties [owner_id]
users (1) ──── (N) favorites [user_id]
users (1) ──── (N) reviews [user_id]
users (1) ──── (N) contacts [user_id]
users (1) ──── (N) alerts [user_id]
users (1) ──── (N) search_history [user_id]

properties (1) ──── (N) favorites [property_id]
properties (1) ──── (N) reviews [property_id]
properties (1) ──── (N) contacts [property_id]
properties (1) ──── (N) search_history [property_id]
```

## Data Types

- **id**: String (UUID)
- **email**: String (validated)
- **password_hash**: String (bcrypt)
- **price**: Float/Number
- **rating**: Integer (1-5)
- **location**: Object {lat: Float, lng: Float}
- **created_at/timestamp**: ISO 8601 String
- **active/pet_friendly**: Boolean
- **amenities**: Array of Strings

## Best Practices

1. Always exclude `_id` field in queries: `{"_id": 0}`
2. Use proper indexes for frequently queried fields
3. Limit query results: `.limit(100)`
4. Use projection to fetch only needed fields
5. Implement compound indexes for multi-field queries
