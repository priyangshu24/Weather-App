import { useState, useRef, useEffect } from "react";
import "./Weather.css";
import Search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icons from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

const Weather = () => {
    const inputRef = useRef();
    const [weather, setWeatherData] = useState({
        humidity: null,
        windSpeed: null,
        temperature: null,
        location: null,
        icon: clear_icon,
    });
    const [searchQuery, setSearchQuery] = useState("");

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icons,
        "09n": rain_icons,
        "10d": rain_icons,
        "10n": rain_icons,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    const search = async (city) => {
        if (city === "") {
            alert("Please enter a city name");
            return;
        }

        try {
            const apiKey = "c2c9a7e51eccda6bc77491204baa54a9"; // Your API key
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.cod !== 200) {
                console.error(`Error fetching weather data: ${data.message}`);
                alert(`Failed to fetch weather data: ${data.message}`);
                return;
            }

            const icon = allIcons[data.weather[0]?.icon] || clear_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon,
            });

            setSearchQuery(""); // Clear input after successful search
        } catch (error) {
            console.error("Error during fetch:", error);
            alert("An error occurred while fetching weather data. Please try again.");
        }
    };

    const searchByCoordinates = async (lat, lon) => {
        try {
            const apiKey = "c2c9a7e51eccda6bc77491204baa54a9";
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.cod !== 200) {
                console.error(`Error fetching weather data: ${data.message}`);
                alert(`Failed to fetch weather data: ${data.message}`);
                return;
            }

            const icon = allIcons[data.weather[0]?.icon] || clear_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon,
            });
        } catch (error) {
            console.error("Error during fetch:", error);
            alert("An error occurred while fetching weather data. Please try again.");
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    searchByCoordinates(latitude, longitude);
                },
                (error) => {
                    console.error("Error fetching location:", error);
                    search("Delhi"); // Fallback to default city
                }
            );
        } else {
            console.warn("Geolocation is not supported by this browser.");
            search("Delhi"); // Fallback to default city
        }
    }, []);

    const handleSearch = () => {
        if (inputRef.current && inputRef.current.value.trim()) {
            search(inputRef.current.value.trim());
        } else {
            alert("Please enter a valid city name.");
        }
    };

    return (
        <div className="Weather">
            <div className="search-bar">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <img src={Search_icon} alt="Search" onClick={handleSearch} />
            </div>
            <img src={weather.icon} alt="Weather Icon" className="weather-icon" />
            <p className="temperature">
                {weather.temperature !== null ? `${weather.temperature}°C` : "Loading..."}
            </p>
            <p className="location">{weather.location || "Unknown Location"}</p>

            <div className="weather-deta">
                <div className="col">
                    <img src={humidity_icon} alt="Humidity" />
                    <div>
                        <p>{weather.humidity !== null ? `${weather.humidity}%` : "N/A"}</p>
                        <span>Humidity</span>
                    </div>
                </div>
                <div className="col">
                    <img src={wind_icon} alt="Wind" />
                    <div>
                        <p>{weather.windSpeed !== null ? `${weather.windSpeed} km/h` : "N/A"}</p>
                        <span>Wind Speed</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Weather;
