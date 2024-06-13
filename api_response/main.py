import requests
import csv
import matplotlib.pyplot as plt
from datetime import datetime

def get_weather(api_key,city):
    url = "http://api.weatherapi.com/v1/current.json?key=149a40c764bc4a1498a15441241106&q=London&aqi=no"
    response = requests.get(url)
    data = response.json()
    return data

def plot_weather(weather_data):
    temperature = []
    timestamps = []
    for hour in weather_data["list"]:
        timestamps.append(datetime.fromtimestamp(hour["dt"]))
        temperature.append(hour["main"]["temp"])
        
        
        plt.plot(timestamps, temperature)
        plt.xlabel('Time')
        plt.ylabel('Temperature (°C)')
        plt.title('Hourly Temperature Forecast')
        plt.xticks(rotation=45)
        plt.grid(True)
        plt.tight_layout()
        plt.show()
        
        
        
def save_weather_to_csv(filename,weather_data):
    with open(filename,mode="w",newline="")as file:
        writer = csv.writer(file)
        writer.writerow(["Timestamp","Temperature(c)","wather Description"])
        
        for hour in weather_data['list']:
            timestamp = datetime.fromtimestamp(hour['dt']).strftime('%Y-%m-%d %H:%M:%S')
            temperature = hour['main']['temp']
            weather_description = hour['weather'][0]['description']
            writer.writerow([timestamp, temperature, weather_description])

    print(f"Weather data successfully written to {filename}")
        
def main():
# Replace 'YOUR_API_KEY' with your actual API key from OpenWeatherMap
    api_key = '149a40c764bc4a1498a15441241106'
    city = 'London'  # Example city
    weather_data = get_weather(api_key, city)

# Plot the weather data
    plot_weather(weather_data)

# Save the weather data to a CSV file
    save_weather_to_csv(weather_data, 'weather_data.csv')

if __name__ == "__main__":
    main()