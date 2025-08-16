import axios from "axios";

const config = {
	baseUrl: "https://api.openweathermap.org/data/2.5/weather",
	apikey: import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY as string,
};

// https://openweathermap.org/current
export const getCurrentWeatherUsingOpenWeatherMap = async (lat: number, lon: number): Promise<OpenWeatherMapCurrentResponse> => {
  try {
    const resp = await axios.get(config.baseUrl, {
      params: {
        appid: config.apikey,
        lat,
        lon,
        units: "metric",
      },
    });

    return {
      status: resp.status,
      data: resp.data,
    };
  } catch (error: unknown) {
    let status = 500;
    let data;

    if (axios.isAxiosError(error)) {
      status = error.response?.status ?? 500;
      data = error.response?.data;
    } else if (error instanceof Error) {
      console.error("Non-Axios error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }

    return { status, data };
  }
};

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

export interface OpenWeatherMapCurrentResponse {
	status: number,
	data: OpenWeatherMapCurrentResponseData
} 