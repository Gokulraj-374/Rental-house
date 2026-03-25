import requests
import os

API_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://rental-recommender.preview.emergentagent.com')
API = f"{API_URL}/api"

# Tamil Nadu cities properties
tamilnadu_properties = [
    # Chennai Properties
    {
        "title": "Luxury 3BHK Apartment in Anna Nagar, Chennai",
        "price": 35000,
        "location": {"lat": 13.0878, "lng": 80.2085},
        "address": "Anna Nagar West, Chennai, Tamil Nadu 600040",
        "bhk": "3BHK",
        "amenities": ["WiFi", "AC", "Gym", "Swimming Pool", "Parking", "Security", "Power Backup", "Lift"],
        "images": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        "description": "Premium apartment in prime Chennai locality with modern amenities"
    },
    {
        "title": "Affordable 2BHK in Tambaram, Chennai",
        "price": 12000,
        "location": {"lat": 12.9226, "lng": 80.1275},
        "address": "East Tambaram, Chennai, Tamil Nadu 600059",
        "bhk": "2BHK",
        "amenities": ["WiFi", "Parking", "Security", "Lift"],
        "images": ["https://images.pexels.com/photos/7511701/pexels-photo-7511701.jpeg?w=800"],
        "description": "Budget-friendly apartment near railway station and IT corridor"
    },
    {
        "title": "Sea View 4BHK Villa in ECR, Chennai",
        "price": 75000,
        "location": {"lat": 12.8496, "lng": 80.2444},
        "address": "East Coast Road, Neelankarai, Chennai, Tamil Nadu 600115",
        "bhk": "4BHK",
        "amenities": ["WiFi", "AC", "Gym", "Swimming Pool", "Parking", "Security", "Power Backup", "Garden", "Balcony"],
        "images": ["https://images.pexels.com/photos/17174767/pexels-photo-17174767.jpeg?w=800"],
        "description": "Luxurious beachfront villa with stunning sea views"
    },
    
    # Coimbatore Properties
    {
        "title": "Modern 2BHK in RS Puram, Coimbatore",
        "price": 15000,
        "location": {"lat": 11.0168, "lng": 76.9558},
        "address": "RS Puram, Coimbatore, Tamil Nadu 641002",
        "bhk": "2BHK",
        "amenities": ["WiFi", "AC", "Parking", "Security", "Lift", "Power Backup"],
        "images": ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
        "description": "Well-maintained apartment in heart of Coimbatore"
    },
    {
        "title": "Spacious 3BHK near Brookefields Mall, Coimbatore",
        "price": 22000,
        "location": {"lat": 11.0258, "lng": 77.0034},
        "address": "Brookefields, Coimbatore, Tamil Nadu 641001",
        "bhk": "3BHK",
        "amenities": ["WiFi", "AC", "Gym", "Parking", "Security", "Lift", "Garden"],
        "images": ["https://images.unsplash.com/photo-1627141234469-24711efb373c?w=800"],
        "description": "Premium apartment near shopping and entertainment hub"
    },
    {
        "title": "Budget 1BHK in Saibaba Colony, Coimbatore",
        "price": 9000,
        "location": {"lat": 11.0234, "lng": 76.9690},
        "address": "Saibaba Colony, Coimbatore, Tamil Nadu 641011",
        "bhk": "1BHK",
        "amenities": ["WiFi", "Parking", "Security"],
        "images": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        "description": "Affordable housing for students and professionals"
    },
    
    # Madurai Properties
    {
        "title": "Traditional 2BHK near Meenakshi Temple, Madurai",
        "price": 10000,
        "location": {"lat": 9.9252, "lng": 78.1198},
        "address": "KK Nagar, Madurai, Tamil Nadu 625020",
        "bhk": "2BHK",
        "amenities": ["WiFi", "Parking", "Security", "Power Backup"],
        "images": ["https://images.pexels.com/photos/7511701/pexels-photo-7511701.jpeg?w=800"],
        "description": "Centrally located apartment near temple and city center"
    },
    {
        "title": "Family 3BHK in Anna Nagar, Madurai",
        "price": 16000,
        "location": {"lat": 9.9312, "lng": 78.0897},
        "address": "Anna Nagar, Madurai, Tamil Nadu 625020",
        "bhk": "3BHK",
        "amenities": ["WiFi", "AC", "Parking", "Security", "Lift", "Garden"],
        "images": ["https://images.unsplash.com/photo-1627141234469-24711efb373c?w=800"],
        "description": "Spacious family apartment in peaceful residential area"
    },
    
    # Trichy Properties
    {
        "title": "Modern 2BHK in Thillai Nagar, Trichy",
        "price": 12000,
        "location": {"lat": 10.8155, "lng": 78.6856},
        "address": "Thillai Nagar, Tiruchirappalli, Tamil Nadu 620018",
        "bhk": "2BHK",
        "amenities": ["WiFi", "AC", "Parking", "Security", "Lift"],
        "images": ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
        "description": "Contemporary apartment in prime commercial area"
    },
    {
        "title": "Affordable 1BHK near BHEL, Trichy",
        "price": 8000,
        "location": {"lat": 10.8276, "lng": 78.6917},
        "address": "Kailasapuram, Tiruchirappalli, Tamil Nadu 620014",
        "bhk": "1BHK",
        "amenities": ["WiFi", "Parking", "Security"],
        "images": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        "description": "Budget-friendly flat near BHEL township"
    },
    
    # Salem Properties
    {
        "title": "Spacious 3BHK in Fairlands, Salem",
        "price": 18000,
        "location": {"lat": 11.6643, "lng": 78.1460},
        "address": "Fairlands, Salem, Tamil Nadu 636016",
        "bhk": "3BHK",
        "amenities": ["WiFi", "AC", "Gym", "Parking", "Security", "Lift", "Power Backup"],
        "images": ["https://images.unsplash.com/photo-1627141234469-24711efb373c?w=800"],
        "description": "Premium apartment in upscale Salem neighborhood"
    },
    {
        "title": "2BHK near Steel Plant, Salem",
        "price": 11000,
        "location": {"lat": 11.6234, "lng": 78.1845},
        "address": "Ammapet, Salem, Tamil Nadu 636003",
        "bhk": "2BHK",
        "amenities": ["WiFi", "Parking", "Security", "Lift"],
        "images": ["https://images.pexels.com/photos/7511701/pexels-photo-7511701.jpeg?w=800"],
        "description": "Convenient location near industrial area"
    },
    
    # Tirunelveli Properties
    {
        "title": "Traditional 2BHK in Town, Tirunelveli",
        "price": 9000,
        "location": {"lat": 8.7139, "lng": 77.7567},
        "address": "Palayamkottai, Tirunelveli, Tamil Nadu 627002",
        "bhk": "2BHK",
        "amenities": ["WiFi", "Parking", "Security"],
        "images": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        "description": "Affordable apartment in central Tirunelveli"
    },
    {
        "title": "3BHK near Medical College, Tirunelveli",
        "price": 14000,
        "location": {"lat": 8.7288, "lng": 77.7086},
        "address": "Medical College Road, Tirunelveli, Tamil Nadu 627011",
        "bhk": "3BHK",
        "amenities": ["WiFi", "AC", "Parking", "Security", "Lift", "Power Backup"],
        "images": ["https://images.unsplash.com/photo-1627141234469-24711efb373c?w=800"],
        "description": "Family-friendly apartment near medical college"
    },
    
    # Erode Properties
    {
        "title": "Modern 2BHK in Perundurai Road, Erode",
        "price": 10000,
        "location": {"lat": 11.3410, "lng": 77.7172},
        "address": "Perundurai Road, Erode, Tamil Nadu 638011",
        "bhk": "2BHK",
        "amenities": ["WiFi", "AC", "Parking", "Security", "Lift"],
        "images": ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
        "description": "Well-connected apartment in textile city"
    },
    
    # Vellore Properties
    {
        "title": "2BHK near VIT University, Vellore",
        "price": 13000,
        "location": {"lat": 12.9698, "lng": 79.1559},
        "address": "Katpadi, Vellore, Tamil Nadu 632014",
        "bhk": "2BHK",
        "amenities": ["WiFi", "AC", "Parking", "Security", "Lift"],
        "images": ["https://images.pexels.com/photos/7511701/pexels-photo-7511701.jpeg?w=800"],
        "description": "Perfect for students and faculty near VIT campus"
    },
    {
        "title": "Affordable 1BHK in Sathuvachari, Vellore",
        "price": 7500,
        "location": {"lat": 12.9165, "lng": 79.1325},
        "address": "Sathuvachari, Vellore, Tamil Nadu 632009",
        "bhk": "1BHK",
        "amenities": ["WiFi", "Parking", "Security"],
        "images": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        "description": "Budget-friendly accommodation in industrial area"
    },
    
    # Thoothukudi Properties
    {
        "title": "Sea View 2BHK in Thoothukudi Port Area",
        "price": 11000,
        "location": {"lat": 8.7642, "lng": 78.1348},
        "address": "New Colony, Thoothukudi, Tamil Nadu 628001",
        "bhk": "2BHK",
        "amenities": ["WiFi", "AC", "Parking", "Security", "Balcony"],
        "images": ["https://images.unsplash.com/photo-1627141234469-24711efb373c?w=800"],
        "description": "Coastal living with port city convenience"
    },
    
    # Tiruppur Properties
    {
        "title": "2BHK in Textile Hub, Tiruppur",
        "price": 12000,
        "location": {"lat": 11.1085, "lng": 77.3411},
        "address": "Avinashi Road, Tiruppur, Tamil Nadu 641603",
        "bhk": "2BHK",
        "amenities": ["WiFi", "AC", "Parking", "Security", "Lift"],
        "images": ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
        "description": "Modern apartment in knitwear capital"
    },
    
    # Thanjavur Properties
    {
        "title": "Heritage 2BHK near Big Temple, Thanjavur",
        "price": 9500,
        "location": {"lat": 10.7870, "lng": 79.1378},
        "address": "Medical College Road, Thanjavur, Tamil Nadu 613004",
        "bhk": "2BHK",
        "amenities": ["WiFi", "Parking", "Security", "Power Backup"],
        "images": ["https://images.pexels.com/photos/7511701/pexels-photo-7511701.jpeg?w=800"],
        "description": "Cultural hub living near UNESCO heritage site"
    },
    
    # Nagercoil Properties
    {
        "title": "2BHK in Downtown Nagercoil",
        "price": 10000,
        "location": {"lat": 8.1790, "lng": 77.4337},
        "address": "Vadasery, Nagercoil, Tamil Nadu 629001",
        "bhk": "2BHK",
        "amenities": ["WiFi", "Parking", "Security", "Lift"],
        "images": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        "description": "Centrally located apartment in southernmost city"
    },
    
    # Hosur Properties
    {
        "title": "IT Park 2BHK in Hosur",
        "price": 14000,
        "location": {"lat": 12.7409, "lng": 77.8253},
        "address": "SIPCOT Industrial Area, Hosur, Tamil Nadu 635126",
        "bhk": "2BHK",
        "amenities": ["WiFi", "AC", "Gym", "Parking", "Security", "Lift", "Power Backup"],
        "images": ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
        "description": "Tech-friendly apartment near IT corridor"
    },
    {
        "title": "Affordable 1RK for Bachelors, Hosur",
        "price": 6500,
        "location": {"lat": 12.7357, "lng": 77.8311},
        "address": "Mathigiri, Hosur, Tamil Nadu 635109",
        "bhk": "1RK",
        "amenities": ["WiFi", "Parking", "Security"],
        "images": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        "description": "Budget accommodation for working professionals"
    },
    
    # Karur Properties
    {
        "title": "2BHK in Textile Town, Karur",
        "price": 9500,
        "location": {"lat": 10.9601, "lng": 78.0766},
        "address": "Thanthoni Road, Karur, Tamil Nadu 639002",
        "bhk": "2BHK",
        "amenities": ["WiFi", "Parking", "Security", "Lift"],
        "images": ["https://images.pexels.com/photos/7511701/pexels-photo-7511701.jpeg?w=800"],
        "description": "Convenient living in textile manufacturing hub"
    },
    
    # Kanchipuram Properties
    {
        "title": "Temple City 2BHK, Kanchipuram",
        "price": 11000,
        "location": {"lat": 12.8342, "lng": 79.7036},
        "address": "Periya Kanchipuram, Kanchipuram, Tamil Nadu 631502",
        "bhk": "2BHK",
        "amenities": ["WiFi", "AC", "Parking", "Security"],
        "images": ["https://images.unsplash.com/photo-1627141234469-24711efb373c?w=800"],
        "description": "Peaceful living in silk and temple city"
    }
]

def seed_tamilnadu_data():
    try:
        print("Starting Tamil Nadu property seeding...")
        
        # Login with demo user
        response = requests.post(f"{API}/auth/login", json={
            "email": "demo@example.com",
            "password": "password123"
        })
        response.raise_for_status()
        token = response.json()["access_token"]
        print("✓ Logged in successfully")
        
        # Add properties
        headers = {"Authorization": f"Bearer {token}"}
        added_count = 0
        skipped_count = 0
        
        for prop in tamilnadu_properties:
            try:
                response = requests.post(f"{API}/properties", json=prop, headers=headers)
                response.raise_for_status()
                added_count += 1
                print(f"✓ Added: {prop['title']}")
            except requests.exceptions.HTTPError:
                skipped_count += 1
                print(f"⚠ Skipped: {prop['title']}")
        
        print(f"\n✅ Tamil Nadu property seeding completed!")
        print(f"📊 Summary: {added_count} added, {skipped_count} skipped")
        print(f"📍 Cities covered: Chennai, Coimbatore, Madurai, Trichy, Salem, Tirunelveli,")
        print(f"   Erode, Vellore, Thoothukudi, Tiruppur, Thanjavur, Nagercoil, Hosur, Karur, Kanchipuram")
        
    except Exception as error:
        print(f"❌ Error seeding data: {error}")

if __name__ == "__main__":
    seed_tamilnadu_data()
