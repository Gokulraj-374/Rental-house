import requests
import sys
import json
from datetime import datetime

class RentalAPITester:
    def __init__(self, base_url="https://rental-recommender.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, params=data)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(response_data) > 0:
                        print(f"   Response keys: {list(response_data.keys())}")
                    elif isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.text and response.status_code < 500 else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_register(self, email, password, name, city="Chennai"):
        """Test user registration"""
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={
                "email": email,
                "password": password,
                "name": name,
                "preferred_city": city,
                "workplace_location": {"lat": 13.0827, "lng": 80.2707, "address": "Chennai"}
            }
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response.get('user', {}).get('id')
            return True
        return False

    def test_login(self, email, password):
        """Test user login"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response.get('user', {}).get('id')
            return True
        return False

    def test_get_me(self):
        """Test get current user"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_create_property(self):
        """Test property creation"""
        property_data = {
            "title": "Test Property - Modern 2BHK",
            "price": 15000,
            "location": {"lat": 13.0827, "lng": 80.2707},
            "address": "Test Street, Chennai, Tamil Nadu",
            "bhk": "2BHK",
            "amenities": ["WiFi", "AC", "Parking"],
            "images": ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
            "description": "A beautiful test property"
        }
        
        success, response = self.run_test(
            "Create Property",
            "POST",
            "properties",
            200,
            data=property_data
        )
        return response.get('id') if success else None

    def test_get_properties(self):
        """Test get all properties"""
        success, response = self.run_test(
            "Get All Properties",
            "GET",
            "properties",
            200
        )
        return success, response

    def test_get_property_by_id(self, property_id):
        """Test get property by ID"""
        success, response = self.run_test(
            "Get Property by ID",
            "GET",
            f"properties/{property_id}",
            200
        )
        return success

    def test_get_recommendations(self):
        """Test AI recommendations"""
        success, response = self.run_test(
            "Get AI Recommendations",
            "GET",
            "recommendations",
            200,
            data={"budget": 15000, "preferred_amenities": "WiFi,AC"}
        )
        return success, response

    def test_calculate_distance(self):
        """Test distance calculation"""
        success, response = self.run_test(
            "Calculate Distance",
            "POST",
            "calculate-distance",
            200,
            data={
                "origin": {"lat": 13.0827, "lng": 80.2707},
                "destination": {"lat": 13.0878, "lng": 80.2785}
            }
        )
        return success

    def test_predict_price(self):
        """Test price prediction"""
        success, response = self.run_test(
            "Predict Price",
            "POST",
            "predict-price",
            200,
            data={
                "location": {"lat": 13.0827, "lng": 80.2707},
                "bhk": "2BHK",
                "amenities": ["WiFi", "AC", "Parking"],
                "address": "Test Street, Chennai"
            }
        )
        return success

    def test_favorites_flow(self, property_id):
        """Test complete favorites flow"""
        # Add to favorites
        success1, _ = self.run_test(
            "Add to Favorites",
            "POST",
            "favorites",
            200,
            data={"property_id": property_id}
        )
        
        # Get favorites
        success2, response = self.run_test(
            "Get Favorites",
            "GET",
            "favorites",
            200
        )
        
        # Remove from favorites
        success3, _ = self.run_test(
            "Remove from Favorites",
            "DELETE",
            f"favorites/{property_id}",
            200
        )
        
        return success1 and success2 and success3

    def test_search_history(self, property_id):
        """Test search history"""
        # Add to search history
        success1, _ = self.run_test(
            "Add to Search History",
            "POST",
            f"search-history?property_id={property_id}",
            200
        )
        
        # Get search history
        success2, response = self.run_test(
            "Get Search History",
            "GET",
            "search-history",
            200
        )
        
        return success1 and success2

    def test_nearby_properties(self):
        """Test nearby properties"""
        success, response = self.run_test(
            "Get Nearby Properties",
            "GET",
            "nearby-properties",
            200
        )
        return success

def main():
    print("🏠 Starting AI Rental House Recommendation System API Tests")
    print("=" * 60)
    
    tester = RentalAPITester()
    test_email = f"test_user_{datetime.now().strftime('%H%M%S')}@example.com"
    test_password = "TestPass123!"
    test_name = "Test User"
    
    # Test user registration and authentication
    print("\n📝 Testing Authentication...")
    if not tester.test_register(test_email, test_password, test_name):
        print("❌ Registration failed, trying with demo account...")
        if not tester.test_login("demo@example.com", "password123"):
            print("❌ Demo login also failed, stopping tests")
            return 1
    
    # Test get current user
    if not tester.test_get_me():
        print("❌ Get current user failed")
        return 1
    
    # Test property operations
    print("\n🏘️ Testing Property Operations...")
    property_id = tester.test_create_property()
    if not property_id:
        print("❌ Property creation failed, using existing properties for remaining tests")
        # Try to get existing properties
        success, properties = tester.test_get_properties()
        if success and properties:
            property_id = properties[0].get('id')
            print(f"✅ Using existing property: {property_id}")
        else:
            print("❌ No properties available for testing")
            return 1
    else:
        print(f"✅ Created test property: {property_id}")
    
    # Test get all properties
    tester.test_get_properties()
    
    # Test get property by ID
    if property_id:
        tester.test_get_property_by_id(property_id)
    
    # Test AI features
    print("\n🤖 Testing AI Features...")
    tester.test_get_recommendations()
    tester.test_calculate_distance()
    tester.test_predict_price()
    tester.test_nearby_properties()
    
    # Test favorites and search history
    print("\n❤️ Testing User Features...")
    if property_id:
        tester.test_favorites_flow(property_id)
        tester.test_search_history(property_id)
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️ {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())