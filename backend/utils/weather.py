import requests
import os
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "7963283259926839") # Placeholder key if not provided

def get_weather(city: str) -> dict:
    """
    Fetch real-time weather data for a given city using OpenWeatherMap API.
    """
    if not city:
        return {"error": "No city provided"}
        
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
        response = requests.get(url, timeout=5)
        data = response.json()
        
        if response.status_code != 200:
            return {"error": data.get("message", "Failed to fetch weather")}
            
        weather_info = {
            "temp": data["main"]["temp"],
            "description": data["weather"][0]["description"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"],
            "city": data["name"]
        }
        return weather_info
    except Exception as e:
        return {"error": str(e)}
