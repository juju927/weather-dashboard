import { WeatherData, WeatherForecastData } from "../common/types";
import countryNamesJSON from "../../../data/countryCodesToNames.json";
import { openWeatherMapApiClient } from "./openWeatherMap/openWeatherMapApi";
import { weatherApiClient } from "./weatherApi/weatherApi";
import { mapWeatherApiResponseToForecastData, mapWeatherApiResponseToWeatherData } from "./weatherApi/helpers";
import { mapOpenWEatherMapApiResponseToForecastData, mapOpenWeatherMapApiResponseToWeatherData } from "./openWeatherMap/helpers";


export enum WeatherApis {
    WEATHER_API, 
    OPEN_WEATHER_MAP_API
}

export interface apiResponse<T> {
    status: number;
    data?: T;
}

export const getWeatherData = async (lat: number, lon: number, api: WeatherApis=WeatherApis.OPEN_WEATHER_MAP_API): Promise<WeatherData|null> => {
    try {
        if (api === WeatherApis.OPEN_WEATHER_MAP_API) {
            const resp = await openWeatherMapApiClient.getCurrentWeather(lat, lon);
            if (resp.status === 200 && resp.data) {
                return mapOpenWeatherMapApiResponseToWeatherData(resp.data);
            }
        } else if (api === WeatherApis.WEATHER_API) {
            const resp = await weatherApiClient.getCurrentWeather(`${lat},${lon}`);
            if (resp.status === 200 && resp.data) {
                return mapWeatherApiResponseToWeatherData(resp.data);
            }
        } else {
            console.log("Incorrect weather api call provided");
            return null;
        }

        return null;

    } catch (err) {
        console.error(err);
        return null;
    }
}

export const getForecastData = async (lat: number, lon: number): Promise<WeatherForecastData|null> => {
    try {
        const resp = await weatherApiClient.getWeatherForecast(`${lat},${lon}`);
        if (resp.status === 200 && resp.data) {
            return mapWeatherApiResponseToForecastData(resp.data)
        }
        console.log("Somehow failed lol");
        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
}

// helpers
const countryNames: Record<string, string> = countryNamesJSON;

export const getCountryName = (code: string): string => {
    return countryNames[code] ?? code;
}

export const getTzOffsetFromTzId = (tzId: string, date = new Date()): number => {
  const local = new Date(date.toLocaleString("en-US", { timeZone: tzId }));
  const diffMinutes = (local.getTime() - date.getTime()) / (1000 * 60);
  return -diffMinutes * 60;
}
