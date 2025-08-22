import { WeatherData, WeatherForecastData_v1 } from "../../common/types";
import { getCountryName } from "../common"
import { OpenWeatherMapCurrentResponseData, OpenWeatherMapForecastResponseData } from "./openWeatherMapApi";


export const mapOpenWeatherMapApiResponseToWeatherData = (data: OpenWeatherMapCurrentResponseData): WeatherData => {
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
        temp_min_c: data?.main?.temp_min,
        temp_max_c: data?.main?.temp_max,
        
        wind_speed: data?.wind?.speed,
        rain_mm: data?.rain?.["1h"] ?? 0,
        clouds_percent: data?.clouds.all,

        visibility: data?.visibility,
        local_sunrise_time: data?.sys?.sunrise,
        local_sunset_time: data?.sys?.sunset,
    }
}

export const mapOpenWeatherMapApiResponseToForecastData = (data: OpenWeatherMapForecastResponseData): Array<WeatherForecastData_v1> => {
    return data.list.map((record) => ({ timestamp_dt: record.dt, weather_main: record.weather[0].main,weather_icon: getWeatherIcon(record.weather[0].icon) }));
}

const getWeatherIcon = (code: string): string => {
    return `http://openweathermap.org/img/wn/${code}.png`
}