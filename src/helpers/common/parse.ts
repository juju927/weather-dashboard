import { TimeOfDay } from "./types";
import countryToLocalJson from "../../../data/countryToLocale.json";
const countryToLocale: { [country: string]: string } = countryToLocalJson;

export const getTimeOfDay = (
	dt: number,
	sunrise: number,
	sunset: number
): TimeOfDay => {
	const BAND_MINUTES = 30;
	const now = dt * 1000;
	const rise = sunrise * 1000;
	const set = sunset * 1000;

	const band = BAND_MINUTES * 60 * 1000;

	if (now > rise - band && now <= rise + band) {
		return TimeOfDay.SUNRISE;
	}

	if (now > rise + band && now <= set - band) {
		return TimeOfDay.DAY;
	}

	if (now > set - band && now <= set + band) {
		return TimeOfDay.SUNSET;
	}

	return TimeOfDay.NIGHT;
};

export const getLocaleTimeString = (
	dt: number,
	country: string,
	tz_id: string,
	options?: Intl.DateTimeFormatOptions
): string => {
	const localTime = new Date(dt * 1000);
	const locale = countryToLocale[country] ?? "en-GB";
	return new Intl.DateTimeFormat(locale, {
		...options,
		timeZone: tz_id,
	}).format(localTime);
};