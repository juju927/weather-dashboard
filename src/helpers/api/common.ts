import { WeatherAPICurrentResponse, WeatherData } from "../common/types";
import countryNamesJSON from "../../../data/countryCodesToNames.json";
import { getCurrentWeatherUsingOpenWeatherMap } from "./openWeatherMapApi";
import { getCurrentWeather } from "./weatherApi";
import { OpenWeatherMapCurrentResponseData } from "./openWeatherMapApi";


export enum WeatherApis {
    WEATHER_API, 
    OPEN_WEATHER_MAP_API
}

export interface WeatherResponse {
    status: number,
    data?: WeatherData,
}

export const getWeatherData = async (api: WeatherApis, lat: number, lon: number): Promise<WeatherResponse> => {
    try {
        if (api === WeatherApis.OPEN_WEATHER_MAP_API) {
            const resp = await getCurrentWeatherUsingOpenWeatherMap(lat, lon);
            if (resp.status === 200 && resp.data) {
                const mapped: WeatherData = mapOpenWeatherMapApiResponseToWeatherData(resp.data);
                return {
                    status: resp.status,
                    data: mapped,
                }
            }
        } else if (api === WeatherApis.WEATHER_API) {
            const resp = await getCurrentWeather(`${lat},${lon}`);
            if (resp.status === 200 && resp.data) {
                const mapped: WeatherData = mapWeatherApiResponseToWeatherData(resp.data);
                return {
                    status: resp.status,
                    data: mapped,
                }
            }
        } else {
            console.log("Incorrect weather api call provided");
            return { status: 500 };
        }

        return { status: 418 }

    } catch (err) {
        console.error(err);
        return { status: 500 };
    }
}

// weather mappers
const mapOpenWeatherMapApiResponseToWeatherData = (data: OpenWeatherMapCurrentResponseData): WeatherData => {
    return {
        location_name: data?.name,
        location_country: getCountryName(data?.sys?.country),
        tz_offset: data?.timezone,
        lat: data?.coord?.lat,
        lon: data?.coord?.lon,

        timestamp_dt: data?.dt,

        weather_main: data?.weather[0]?.main,
        weather_icon: getWeatherIcon(data?.weather[0].icon),

        temp_c: data?.main?.temp,
        feelslike_temp_c: data?.main?.feels_like,
        
        wind_speed: data?.wind?.speed,
        rain_mm: data?.rain?.["1h"] ?? 0,
        clouds_percent: data?.clouds.all,
    }
}

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
    }
}

// helpers
const countryNames: Record<string, string> = countryNamesJSON;

const getCountryName = (code: string): string => {
    return countryNames[code] ?? code;
}

const getWeatherIcon = (code: string): string => {
    return `http://openweathermap.org/img/wn/${code}.png`
}

const getTzOffsetFromTzId = (tzId: string, date = new Date()): number => {
  const local = new Date(date.toLocaleString("en-US", { timeZone: tzId }));
  const diffMinutes = (local.getTime() - date.getTime()) / (1000 * 60);
  return -diffMinutes * 60;
}
