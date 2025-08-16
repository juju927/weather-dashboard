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

	wind_speed: number;
	rain_mm: number;
	clouds_percent: number;
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

export interface WeatherAPICurrentResponse {
	location: {
		name: string;
		region: string;
		country: string;
		lat: number;
		lon: number;
		tz_id: string;
		localtime_epoch: number;
		localtime: string;
	};
	current: {
		last_updated_epoch: number;
		last_updated: string;
		temp_c: number;
		temp_f: number;
		is_day: number;
		condition: {
			text: string;
			icon: string;
			code: number;
		};
		wind_mph: number;
		wind_kph: number;
		wind_degree: number;
		wind_dir: string;
		pressure_mb: number;
		pressure_in: number;
		precip_mm: number;
		precip_in: number;
		humidity: number;
		cloud: number;
		feelslike_c: number;
		feelslike_f: number;
		windchill_c: number;
		windchill_f: number;
		heatindex_c: number;
		heatindex_f: number;
		dewpoint_c: number;
		dewpoint_f: number;
		vis_km: number;
		vis_miles: number;
		uv: number;
		gust_mph: number;
		gust_kph: number;
		short_rad: number;
		diff_rad: number;
		dni: number;
		gti: number;
	};
}
