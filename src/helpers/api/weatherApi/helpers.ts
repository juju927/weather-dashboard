import { WeatherAPICurrentResponse, WeatherAPIForecastResponse } from "./weatherApi"
import { WeatherData, WeatherForecastData } from "../../common/types"
import { getTzOffsetFromTzId } from "../common"

export const mapWeatherApiResponseToWeatherData = (data: WeatherAPICurrentResponse): WeatherData => {
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

export const mapWeatherApiResponseToForecastData = (data: WeatherAPIForecastResponse): WeatherForecastData => {
    return {
        location: {
            lat: data.location.lat,
            lon: data.location.lon,
            tz_id: data.location.tz_id
        },
        forecast: {
            day: data.forecast.forecastday.map((dayData) => ({
                date: dayData.date,
                date_epoch: dayData.date_epoch,
                maxtemp_c: dayData.day.maxtemp_c,
                mintemp_c: dayData.day.mintemp_c,
                condition: {
                    text: dayData.day.condition.text,
                    icon: dayData.day.condition.icon
                },
                hour: dayData.hour.map((hourData) => ({
                    time_epoch: hourData.time_epoch,
                    time: hourData.time,
                    condition: {
                        text: hourData.condition.text,
                        icon: hourData.condition.icon
                    }
                }))
            }))
        }
    }  
}