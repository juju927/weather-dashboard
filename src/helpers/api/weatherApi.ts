import axios, { AxiosRequestConfig } from "axios";

class WeatherApiClient {
    private readonly BASE_URL = "https://api.weatherapi.com/v1";
    private readonly API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    private async get<T>(endpoint: string, params: Record<string, any>): Promise<{ status: number; data: T }> {
        try {
            const config: AxiosRequestConfig = {
                params: {
                    ...params,
                    key: this.API_KEY,
                }
            };

            const resp = await axios.get<T>(`${this.BASE_URL}${endpoint}`, config);
            return {
                status: resp.status,
                data: resp.data
            }
        } catch (error: any) {
            console.error(`GET ${endpoint} failed`, error);

            const status = error?.status ?? 500;
            const message = error?.message ?? "Unknown error"
            return { status, data: message };
        }
    }

    async searchForLocation(query: string): Promise<{status: number; data: LocationSearchResponse[] }> {
        return this.get<LocationSearchResponse[]>("/search.json", { q: query });
    }

    async getTimeZone(lat: number, lon: number): Promise<{status: number; data: TimeZoneResponse }> {
        return this.get<TimeZoneResponse>("/timezone.json", { q: `${lat},${lon}`});
    }

    async getCurrentWeather(query: string): Promise<{status: number; data: WeatherAPICurrentResponse }> {
        return this.get<WeatherAPICurrentResponse>("/current.json", { q: query, aqi: "no" });
    }
}

export const weatherApiClient = new WeatherApiClient();

// types
export interface LocationSearchResponse {
	id: number;
	name: string;
	region: string;
	country: string;
	lat: number;
	lon: number;
	url: string;
}

export interface TimeZoneResponse {
    location: {
        name: string,
        region: string,
        country: string,
        lat: number,
        lon: number,
        tz_id: string,
        localtime_epoch: number,
        localtime: string,
    }
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