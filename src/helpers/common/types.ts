export interface WeatherData {
	location_name: string;
	location_country: string;
	tz_offset: number;
	lat: number;
	lon: number;
	timestamp_dt: number;

	weather_main: string;
	weather_icon: string;

	temp_c: number;
	feelslike_temp_c: number;
	temp_min_c?: number;
	temp_max_c?: number;

	wind_speed: number;
	rain_mm: number;
	clouds_percent: number;

	visibility: number,
	local_sunrise_time?: number,
	local_sunset_time?: number,
}

export interface WeatherForecastData_v1 {
	timestamp_dt: number;
	weather_main: string;
	weather_icon: string;
}

export interface WeatherForecastData {
	location: {
		country: string;
		lat: number;
		lon: number;
		tz_id: string;	
	};
	forecast: {
		day: ForecastDay[]
	}
}

interface ForecastDay {
	date: string,
	date_epoch: number;
	maxtemp_c: number;
	mintemp_c: number;
	condition: Condition;
	hour: ForecastHour[]
}

interface Condition {
	text: string;
	icon: string;
}

interface ForecastHour {
	time_epoch: number;
	time: string;
	condition: Condition;
}

export enum TimeOfDay {
	SUNRISE = "sunrise",
	DAY = "day",
	SUNSET = "sunset",
	NIGHT = "night",
}

// https://openweathermap.org/weather-conditions
export enum WeatherConditions {
	THUNDERSTORM = "thunderstorm",
	DRIZZLE = "drizzle",
	RAIN = "rain",
	SNOW = "snow",
	ATMOSPHERE = "atmosphere", // fog, mist, haze
	CLEAR = "clear",
	CLOUDS = "clouds",
}

