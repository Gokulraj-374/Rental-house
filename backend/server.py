from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import math

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    preferred_city: Optional[str] = None
    workplace_location: Optional[dict] = None  # {lat, lng, address}

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    preferred_city: Optional[str] = None
    workplace_location: Optional[dict] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class Property(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    price: float
    location: dict  # {lat, lng}
    address: str
    bhk: str
    amenities: List[str]
    images: List[str]
    owner_id: str
    description: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class PropertyCreate(BaseModel):
    title: str
    price: float
    location: dict
    address: str
    bhk: str
    amenities: List[str]
    images: List[str]
    description: Optional[str] = None

class PropertyWithScore(BaseModel):
    property: Property
    ai_score: float
    distance_km: Optional[float] = None
    travel_time_minutes: Optional[int] = None
    price_match_score: float
    distance_score: float
    amenities_score: float

class Favorite(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    property_id: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class FavoriteCreate(BaseModel):
    property_id: str

class DistanceRequest(BaseModel):
    origin: dict  # {lat, lng}
    destination: dict  # {lat, lng}

class DistanceResponse(BaseModel):
    distance_km: float
    travel_time_minutes: int

class PricePredictionRequest(BaseModel):
    location: dict
    bhk: str
    amenities: List[str]
    address: str

class PricePredictionResponse(BaseModel):
    predicted_price: float
    confidence: str

class SearchHistory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    property_id: str
    viewed_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Utility functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate distance between two points using Haversine formula"""
    R = 6371  # Earth's radius in kilometers
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lng = math.radians(lng2 - lng1)
    
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lng/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    distance = R * c
    
    return round(distance, 2)

def calculate_travel_time(distance_km: float) -> int:
    """Estimate travel time in minutes (assuming average speed of 30 km/h in city)"""
    avg_speed = 30  # km/h
    time_hours = distance_km / avg_speed
    return round(time_hours * 60)

def calculate_ai_score(property_price: float, user_budget: float, distance_km: float, 
                      property_amenities: List[str], preferred_amenities: List[str]) -> dict:
    """Calculate AI recommendation score"""
    # Price match score (40%)
    if user_budget > 0:
        price_diff = abs(property_price - user_budget) / user_budget
        price_match = max(0, 1 - price_diff)
    else:
        price_match = 0.5
    
    # Distance score (30%)
    if distance_km <= 2:
        distance_score = 1.0
    elif distance_km <= 5:
        distance_score = 0.8
    elif distance_km <= 10:
        distance_score = 0.6
    elif distance_km <= 15:
        distance_score = 0.4
    else:
        distance_score = max(0, 1 - (distance_km / 50))
    
    # Amenities match score (30%)
    if preferred_amenities:
        matching_amenities = set(property_amenities) & set(preferred_amenities)
        amenities_score = len(matching_amenities) / len(preferred_amenities)
    else:
        amenities_score = len(property_amenities) / 10  # Reward more amenities
        amenities_score = min(amenities_score, 1.0)
    
    # Calculate final score
    ai_score = (price_match * 0.4) + (distance_score * 0.3) + (amenities_score * 0.3)
    
    return {
        "ai_score": round(ai_score * 100, 1),
        "price_match_score": round(price_match * 100, 1),
        "distance_score": round(distance_score * 100, 1),
        "amenities_score": round(amenities_score * 100, 1)
    }

def predict_price(bhk: str, amenities: List[str], address: str) -> dict:
    """Rule-based price prediction"""
    base_prices = {
        "1RK": 6000,
        "1BHK": 8000,
        "2BHK": 12000,
        "3BHK": 18000,
        "4BHK": 25000,
        "5BHK": 35000
    }
    
    base_price = base_prices.get(bhk, 10000)
    
    # Add price for amenities
    amenity_values = {
        "WiFi": 500,
        "AC": 1500,
        "Gym": 1000,
        "Swimming Pool": 2000,
        "Parking": 800,
        "Security": 500,
        "Power Backup": 700,
        "Lift": 600,
        "Garden": 800,
        "Balcony": 500
    }
    
    amenity_premium = sum(amenity_values.get(a, 200) for a in amenities)
    
    # Location premium (simple heuristic)
    location_premium = 0
    premium_areas = ["downtown", "city center", "prime", "central", "metro", "it park", "tech park"]
    address_lower = address.lower()
    if any(area in address_lower for area in premium_areas):
        location_premium = base_price * 0.3
    
    predicted = base_price + amenity_premium + location_premium
    
    return {
        "predicted_price": round(predicted, 2),
        "confidence": "Medium"
    }

# Routes
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        email=user_data.email,
        name=user_data.name,
        preferred_city=user_data.preferred_city,
        workplace_location=user_data.workplace_location
    )
    
    user_dict = user.model_dump()
    user_dict["password_hash"] = hash_password(user_data.password)
    
    await db.users.insert_one(user_dict)
    
    # Create token
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user["id"]})
    
    user_obj = User(**user)
    return Token(access_token=access_token, token_type="bearer", user=user_obj)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: dict = Depends(get_current_user)):
    return User(**current_user)

@api_router.post("/properties", response_model=Property)
async def create_property(property_data: PropertyCreate, current_user: dict = Depends(get_current_user)):
    property_obj = Property(
        **property_data.model_dump(),
        owner_id=current_user["id"]
    )
    
    property_dict = property_obj.model_dump()
    await db.properties.insert_one(property_dict)
    
    return property_obj

@api_router.get("/properties", response_model=List[Property])
async def get_properties(
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    bhk: Optional[str] = None,
    amenities: Optional[str] = None
):
    query = {}
    
    if city:
        query["address"] = {"$regex": city, "$options": "i"}
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price
    if bhk:
        query["bhk"] = bhk
    if amenities:
        amenity_list = [a.strip() for a in amenities.split(",")]
        query["amenities"] = {"$in": amenity_list}
    
    properties = await db.properties.find(query, {"_id": 0}).to_list(1000)
    return properties

@api_router.get("/properties/{property_id}", response_model=Property)
async def get_property(property_id: str):
    property_obj = await db.properties.find_one({"id": property_id}, {"_id": 0})
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    
    return property_obj

@api_router.get("/recommendations", response_model=List[PropertyWithScore])
async def get_recommendations(
    budget: float = 15000,
    preferred_amenities: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    properties = await db.properties.find({}, {"_id": 0}).to_list(1000)
    
    if not properties:
        return []
    
    amenities_list = []
    if preferred_amenities:
        amenities_list = [a.strip() for a in preferred_amenities.split(",")]
    
    # Calculate scores for each property
    scored_properties = []
    user_location = current_user.get("workplace_location", {})
    user_lat = user_location.get("lat", 13.0827)  # Default to Chennai
    user_lng = user_location.get("lng", 80.2707)
    
    for prop in properties:
        prop_lat = prop["location"].get("lat", 0)
        prop_lng = prop["location"].get("lng", 0)
        
        distance_km = calculate_distance(user_lat, user_lng, prop_lat, prop_lng)
        travel_time = calculate_travel_time(distance_km)
        
        scores = calculate_ai_score(
            prop["price"],
            budget,
            distance_km,
            prop["amenities"],
            amenities_list
        )
        
        scored_properties.append(PropertyWithScore(
            property=Property(**prop),
            ai_score=scores["ai_score"],
            distance_km=distance_km,
            travel_time_minutes=travel_time,
            price_match_score=scores["price_match_score"],
            distance_score=scores["distance_score"],
            amenities_score=scores["amenities_score"]
        ))
    
    # Sort by AI score
    scored_properties.sort(key=lambda x: x.ai_score, reverse=True)
    
    return scored_properties[:20]  # Return top 20

@api_router.post("/calculate-distance", response_model=DistanceResponse)
async def calculate_distance_endpoint(request: DistanceRequest):
    distance_km = calculate_distance(
        request.origin["lat"],
        request.origin["lng"],
        request.destination["lat"],
        request.destination["lng"]
    )
    travel_time = calculate_travel_time(distance_km)
    
    return DistanceResponse(distance_km=distance_km, travel_time_minutes=travel_time)

@api_router.post("/predict-price", response_model=PricePredictionResponse)
async def predict_price_endpoint(request: PricePredictionRequest):
    result = predict_price(request.bhk, request.amenities, request.address)
    return PricePredictionResponse(**result)

@api_router.post("/favorites", response_model=Favorite)
async def add_favorite(favorite_data: FavoriteCreate, current_user: dict = Depends(get_current_user)):
    # Check if already favorited
    existing = await db.favorites.find_one({
        "user_id": current_user["id"],
        "property_id": favorite_data.property_id
    }, {"_id": 0})
    
    if existing:
        return Favorite(**existing)
    
    favorite = Favorite(
        user_id=current_user["id"],
        property_id=favorite_data.property_id
    )
    
    favorite_dict = favorite.model_dump()
    await db.favorites.insert_one(favorite_dict)
    
    return favorite

@api_router.get("/favorites", response_model=List[Property])
async def get_favorites(current_user: dict = Depends(get_current_user)):
    favorites = await db.favorites.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(1000)
    
    if not favorites:
        return []
    
    property_ids = [f["property_id"] for f in favorites]
    properties = await db.properties.find({"id": {"$in": property_ids}}, {"_id": 0}).to_list(1000)
    
    return properties

@api_router.delete("/favorites/{property_id}")
async def remove_favorite(property_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.favorites.delete_one({
        "user_id": current_user["id"],
        "property_id": property_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    return {"message": "Favorite removed"}

@api_router.post("/search-history")
async def add_search_history(property_id: str, current_user: dict = Depends(get_current_user)):
    history = SearchHistory(
        user_id=current_user["id"],
        property_id=property_id
    )
    
    await db.search_history.insert_one(history.model_dump())
    return {"message": "Added to history"}

@api_router.get("/search-history", response_model=List[Property])
async def get_search_history(current_user: dict = Depends(get_current_user)):
    # Get last 10 viewed properties
    history = await db.search_history.find(
        {"user_id": current_user["id"]},
        {"_id": 0}
    ).sort("viewed_at", -1).limit(10).to_list(10)
    
    if not history:
        return []
    
    property_ids = [h["property_id"] for h in history]
    properties = await db.properties.find({"id": {"$in": property_ids}}, {"_id": 0}).to_list(1000)
    
    # Maintain order
    property_map = {p["id"]: p for p in properties}
    ordered_properties = [property_map[pid] for pid in property_ids if pid in property_map]
    
    return ordered_properties

@api_router.get("/nearby-properties", response_model=List[Property])
async def get_nearby_properties(current_user: dict = Depends(get_current_user)):
    user_location = current_user.get("workplace_location", {})
    if not user_location:
        # Return random properties
        properties = await db.properties.find({}, {"_id": 0}).limit(10).to_list(10)
        return properties
    
    user_lat = user_location.get("lat", 0)
    user_lng = user_location.get("lng", 0)
    
    all_properties = await db.properties.find({}, {"_id": 0}).to_list(1000)
    
    # Calculate distances
    properties_with_distance = []
    for prop in all_properties:
        prop_lat = prop["location"].get("lat", 0)
        prop_lng = prop["location"].get("lng", 0)
        distance = calculate_distance(user_lat, user_lng, prop_lat, prop_lng)
        properties_with_distance.append((distance, prop))
    
    # Sort by distance
    properties_with_distance.sort(key=lambda x: x[0])
    
    # Return closest 10
    nearby = [p[1] for p in properties_with_distance[:10]]
    return nearby

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()