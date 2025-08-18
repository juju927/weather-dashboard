import axios, { AxiosRequestConfig } from "axios";
import { apiResponse } from "../common";

class OpenWeatherMapApiClient {
	private readonly BASE_URL = "https://api.openweathermap.org/data/2.5";
	private readonly API_KEY = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY;

	private async get<T>(endpoint: string, params: Record<string, any>): Promise<{ status: number; data: T}> {
		try {
			const config: AxiosRequestConfig = {
				params: {
					...params,
					appid: this.API_KEY,
					units: "metric",
				}
			};

			const resp = await axios.get<T>(`${this.BASE_URL}${endpoint}`, config);
			return {
				status: resp.status,
				data: resp.data
			}
		} catch (error: any) {
			console.error(`GET ${endpoint} failed for OpenWeatherMap API Client\n`, error)

			const status = error?.status ?? 500;
			const message = error?.message ?? "Unknown error"
			return { status, data: message }
		}
	}

	// https://openweathermap.org/current
	async getCurrentWeather(lat: number, lon: number): Promise<apiResponse<OpenWeatherMapCurrentResponseData>> {
		return this.get<OpenWeatherMapCurrentResponseData>("/weather", { lat: lat, lon: lon });
	}

	// https://openweathermap.org/forecast5 (5 day, 3 hour interval)
	// cnt is # of timestamps returned
	async getForecast(lat: number, lon: number): Promise<apiResponse<OpenWeatherMapForecastResponseData>> {
		return this.get<OpenWeatherMapForecastResponseData>("/forecast", { lat: lat, lon: lon, cnt: 5 });
	}
}

export const openWeatherMapApiClient = new OpenWeatherMapApiClient();


// types
export interface OpenWeatherMapCurrentResponseData {
	coord: {
		lon: number;
		lat: number;
	};
	weather: Array<{
		id: number;
		main: string;
		description: string;
		icon: string;
	}>;
	base: string;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
		sea_level?: number;
		grnd_level?: number;
	};
	visibility: number;
	wind: {
		speed: number;
		deg: number;
		gust?: number;
	};
	rain?: {
		"1h": number;
		"3h"?: number;
	};
	snow?: {
		"1h": number;
		"3h"?: number;
	};
	clouds: {
		all: number;
	};
	dt: number;
	sys: {
		type: number;
		id: number;
		country: string;
		sunrise: number;
		sunset: number;
	};
	timezone: number;
	id: number;
	name: string;
	cod: number;
}

export interface OpenWeatherMapForecastResponseData {
  cod: string; // note: comes as string in their API ("200")
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    visibility: number;
    pop: number; // probability of precipitation
    rain?: {
      "3h": number;
    };
    snow?: {
      "3h": number;
    };
    sys: {
      pod: "d" | "n"; // part of day
    };
    dt_txt: string; // forecast time as text
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}