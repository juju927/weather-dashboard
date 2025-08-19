import { getLocaleTimeString } from "../helpers/common/parse";

const WeatherCardForecastComponent = ({ forecastData, data }) => {
	const getCurrentHour = () => {
		return getLocaleTimeString(
			forecastData.timestamp_dt,
			data.location_country,
			data.tz_id,
			{ hour: "numeric", minute: undefined, hour12: true }
		);
	};
	return (
		<div className="flex flex-col items-center uppercase font-light text-xs text-[var(--wc-subtext)]">
			<div>{getCurrentHour()}</div>
			<img
				className="h-8 w-8 md:h-12 md:w-12"
				src={forecastData.weather_icon}
				alt={forecastData.weather_main}
			/>
		</div>
	);
};
export default WeatherCardForecastComponent;
