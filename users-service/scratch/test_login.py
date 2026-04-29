import requests

url = "http://localhost:8000/api/users/login/"
data = {
    "username": "admin_user",
    "password": "SecurePassword123!"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
