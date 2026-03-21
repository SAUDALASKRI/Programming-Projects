from flask import Flask, render_template, jsonify
import urllib.request
import json
import os

app = Flask(__name__)

API_KEY = os.environ.get("OPENWEATHER_API_KEY", "YOUR_API_KEY_HERE")
CITY = "Taif"
COUNTRY = "SA"
UNITS = "metric"
LANG = "ar"

def get_weather():
    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?q={CITY},{COUNTRY}&appid={API_KEY}&units={UNITS}&lang={LANG}"
    )
    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode())
        return {
            "city": "الطائف",
            "country": "المملكة العربية السعودية",
            "temp": round(data["main"]["temp"]),
            "feels_like": round(data["main"]["feels_like"]),
            "temp_min": round(data["main"]["temp_min"]),
            "temp_max": round(data["main"]["temp_max"]),
            "humidity": data["main"]["humidity"],
            "pressure": data["main"]["pressure"],
            "description": data["weather"][0]["description"],
            "icon": data["weather"][0]["icon"],
            "wind_speed": round(data["wind"]["speed"] * 3.6, 1),  # m/s to km/h
            "wind_deg": data["wind"].get("deg", 0),
            "visibility": round(data.get("visibility", 0) / 1000, 1),
            "clouds": data["clouds"]["all"],
            "sunrise": data["sys"]["sunrise"],
            "sunset": data["sys"]["sunset"],
            "error": None,
        }
    except Exception as e:
        return {"error": str(e)}


@app.route("/")
def index():
    weather = get_weather()
    return render_template("index.html", weather=weather)


@app.route("/api/weather")
def api_weather():
    return jsonify(get_weather())


if __name__ == "__main__":
    app.run(debug=True)
