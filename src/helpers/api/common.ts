import { WeatherData, WeatherForecastData } from "../common/types";
import countryNamesJSON from "../../../data/countryCodesToNames.json";
import { openWeatherMapApiClient } from "./openWeatherMap/openWeatherMapApi";

import { weatherApiClient, WeatherAPICurrentResponse } from "./weatherApi";
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

export const getForecastData = async (lat: number, lon: number): Promise<WeatherForecastData[]|null> => {
    try {
        const resp = await openWeatherMapApiClient.getForecast(lat, lon);
        if (resp.status === 200 && resp.data) {
            return mapOpenWEatherMapApiResponseToForecastData(resp.data);
        }  
        console.log("Somehow failed lol");
        return null;
    } catch (err) {
        console.error(err);
        return null;
    }
}


// weather mappers
const mapWeatherApiResponseToWeatherData = (data: WeatherAPICurrentResponse): WeatherData => {
    return {
        location_name: data?.location?.name,
        location_country: data?.location?.country,
        tz_offset: getTzOffsetFromTzId(data?.location?.tz_id),
        lat: data?.location?.lat,
        lon: data?.location?.lon,
        timestamp_dt: data?.current?.last_updated_epoch,

        weather_main: data?.current?.condition?.text,
        weather_icon: data?.current?.condition?.icon,

        temp_c: data?.current?.temp_c,
        feelslike_temp_c: data?.current?.feelslike_c,
        
        wind_speed: data?.current?.wind_mph,
        rain_mm: data?.current?.precip_mm,
        clouds_percent: data?.current?.cloud,

        visibility: data?.current?.vis_km,
    }
}

// helpers
const countryNames: Record<string, string> = countryNamesJSON;

export const getCountryName = (code: string): string => {
    return countryNames[code] ?? code;
}

const getTzOffsetFromTzId = (tzId: string, date = new Date()): number => {
  const local = new Date(date.toLocaleString("en-US", { timeZone: tzId }));
  const diffMinutes = (local.getTime() - date.getTime()) / (1000 * 60);
  return -diffMinutes * 60;
}
