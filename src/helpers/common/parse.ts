import { TimeOfDay } from "./types";
import countryToLocalJson from "../../../data/countryToLocale.json";
const countryToLocale: { [country: string]: string } = countryToLocalJson;

export const getTimeOfDay = (dt: number, sunrise: number, sunset: number): TimeOfDay => {
    const now = dt * 1000;
    const rise = sunrise * 1000;
    const set = sunset * 1000;

    const band = 30 * 60 * 1000;

    if (now >= rise - band && now <= rise + band) {
        return TimeOfDay.SUNRISE;
    } else if (now >= set - band && now <= set + band) {
        return TimeOfDay.SUNSET;
    } else if (now > rise + band && now < set - band) {
        return TimeOfDay.DAY;
    } else {
        return TimeOfDay.NIGHT;
    }
}

export const getLocaleTimeString = (dt: number, tz_offset: number, country: string, lat:number, lon: number): string => {
    const localTime = new Date((dt) * 1000);
    const locale = countryToLocale[country] ?? "en-GB";
    console.log(locale)
    return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(localTime);
}