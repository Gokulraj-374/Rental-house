import requests
import os

API_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://rental-recommender.preview.emergentagent.com')
API = f"{API_URL}/api"

# Sample user
sample_user = {
    "email": "demo@example.com",
    "password": "password123",
    "name": "Demo User",
    "preferred_city": "Chennai",
    "workplace_location": {
        "lat": 13.0827,
        "lng": 80.2707,
        "address": "T. Nagar, Chennai"
    }
}

# Sample properties
sample_properties = [
    {
        "title": "Modern 2BHK Apartment in T. Nagar",
        "price": 18000,
        "location": {"lat": 13.0418, "lng": 80.2341},
        "address": "T. Nagar, Chennai, Tamil Nadu 600017",
        "bhk": "2BHK",
        "amenities": ["WiFi", "AC", "Parking", "Security", "Lift"],
        "images": [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            "https://images.pexels.com/photos/7511701/pexels-photo-7511701.jpeg?w=800"
        ],
        "description": "Beautiful modern apartment with all amenities in prime location"
    },
    {
        "title": "Spacious 3BHK with Sea View in Besant Nagar",
        "price": 32000,
        "location": {"lat": 13.0005, "lng": 80.2669},
        "address": "Besant Nagar, Chennai, Tamil Nadu 600090",
        "bhk": "3BHK",
        "amenities": ["WiFi", "AC", "Gym", "Swimming Pool", "Parking", "Security", "Power Backup", "Lift", "Balcony"],
        "images": [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            "https://images.unsplash.com/photo-1627141234469-24711efb373c?w=800"
        ],
        "description": "Luxurious 3BHK apartment with stunning sea views and premium amenities"
    },
    {
        "title": "Cozy 1BHK Near IT Park, Velachery",
        "price": 12000,
        "location": {"lat": 12.9756, "lng": 80.2195},
        "address": "Velachery, Chennai, Tamil Nadu 600042",
        "bhk": "1BHK",
        "amenities": ["WiFi", "AC", "Parking", "Security", "Power Backup", "Lift"],
        "images": ["https://images.unsplash.com/photo-1772475329856-7c7de908b44e?w=800"],
        "description": "Perfect for working professionals, close to IT parks and metro"
    },
    {
        "title": "Affordable 2BHK in Anna Nagar",
        "price": 16000,
        "location": {"lat": 13.0878, "lng": 80.2085},
        "address": "Anna Nagar, Chennai, Tamil Nadu 600040",
        "bhk": "2BHK",
        "amenities": ["WiFi", "Parking", "Security", "Lift", "Garden"],
        "images": ["https://images.pexels.com/photos/7511701/pexels-photo-7511701.jpeg?w=800"],
        "description": "Well-maintained apartment in residential area with good connectivity"
    },
    {
        "title": "Premium 4BHK Villa in Adyar",
        "price": 55000,
        "location": {"lat": 13.0067, "lng": 80.2573},
        "address": "Adyar, Chennai, Tamil Nadu 600020",
        "bhk": "4BHK",
        "amenities": ["WiFi", "AC", "Gym", "Swimming Pool", "Parking", "Security", "Power Backup", "Garden", "Balcony"],
        "images": [
            "https://images.pexels.com/photos/17174767/pexels-photo-17174767.jpeg?w=800",
            "https://images.unsplash.com/photo-1627141234469-24711efb373c?w=800"
        ],
        "description": "Luxurious independent villa with all modern amenities in prime locality"
    },
    {
        "title": "Budget 1RK in Porur",
        "price": 8000,
        "location": {"lat": 13.0358, "lng": 80.1560},
        "address": "Porur, Chennai, Tamil Nadu 600116",
        "bhk": "1RK",
        "amenities": ["WiFi", "Parking", "Security"],
        "images": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        "description": "Compact and affordable room for students and young professionals"
    },
    {
        "title": "Family 3BHK in Mylapore",
        "price": 28000,
        "location": {"lat": 13.0339, "lng": 80.2619},
        "address": "Mylapore, Chennai, Tamil Nadu 600004",
        "bhk": "3BHK",
        "amenities": ["WiFi", "AC", "Parking", "Security", "Power Backup", "Lift", "Garden", "Balcony"],
        "images": ["https://images.pexels.com/photos/7511701/pexels-photo-7511701.jpeg?w=800"],
        "description": "Spacious family apartment in cultural heart of Chennai"
    },
    {
        "title": "Modern 2BHK in OMR Sholinganallur",
        "price": 19000,
        "location": {"lat": 12.9010, "lng": 80.2279},
        "address": "Sholinganallur, Chennai, Tamil Nadu 600119",
        "bhk": "2BHK",
        "amenities": ["WiFi", "AC", "Gym", "Swimming Pool", "Parking", "Security", "Power Backup", "Lift"],
        "images": ["https://images.unsplash.com/photo-1772475329856-7c7de908b44e?w=800"],
        "description": "Premium apartment in IT corridor with excellent amenities"
    }
]

def seed_data():
    try:
        print("Starting data seeding...")
        
        # Register demo user
        token = None
        try:
            response = requests.post(f"{API}/auth/register", json=sample_user)
            response.raise_for_status()
            token = response.json()["access_token"]
            print("✓ Demo user registered")
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 400:
                # User exists, try login
                response = requests.post(f"{API}/auth/login", json={
                    "email": sample_user["email"],
                    "password": sample_user["password"]
                })
                response.raise_for_status()
                token = response.json()["access_token"]
                print("✓ Logged in with existing demo user")
            else:
                raise
        
        # Add properties
        headers = {"Authorization": f"Bearer {token}"}
        for prop in sample_properties:
            try:
                response = requests.post(f"{API}/properties", json=prop, headers=headers)
                response.raise_for_status()
                print(f"✓ Added property: {prop['title']}")
            except requests.exceptions.HTTPError:
                print(f"⚠ Skipped (may already exist): {prop['title']}")
        
        print("\n✅ Data seeding completed!")
        print("\nDemo credentials:")
        print("Email: demo@example.com")
        print("Password: password123")
        
    except Exception as error:
        print(f"❌ Error seeding data: {error}")

if __name__ == "__main__":
    seed_data()
