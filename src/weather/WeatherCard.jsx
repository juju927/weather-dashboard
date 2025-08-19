import { getLocaleTimeString } from "../helpers/common/parse";
import { TimeOfDay } from "../helpers/common/types";
import WeatherCardComponent from "./WeatherCardComponent";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import { FaMagnifyingGlass } from "react-icons/fa6";
import WeatherCardForecastComponent from "./WeatherCardForecastComponent";

const WeatherCard = ({ data, timeOfDay, handleModalOpen, forecastData }) => {
	return (
		<div
			data-time={timeOfDay}
			className="relative z-10 w-full sm:w-4/5 max-w-2xl pt-10 p-6 h-fit rounded-none sm:rounded-xl backdrop-blur-md flex flex-col items-center text-center space-y-6"
		>
			{/* location name */}
			<section onClick={handleModalOpen} className="cursor-pointer">
				<div className="flex items-center gap-2">
					<FaMagnifyingGlass />
					<h1 className="text-center text-2xl font-semibold tracking-wide text-[var(--wc-country)]">
						{data?.location_country}
					</h1>
				</div>

				<div className="text-xs text-[var(--wc-name)]">
					{data?.location_name}
				</div>
			</section>

			{/* temp & weather */}
			<section className="mt-5 w-fit">
				<div className="flex justify-center items-center text-2xl tracking-wide text-[var(--wc-weather)]">
					<img src={data?.weather_icon} />
					<div>{data?.weather_main}</div>
				</div>

				<div className="flex justify-center mx-3 -mt-5">
					<div className="relative text-8xl font-bold text-[var(--wc-temp)]">
						{data?.temp_c.toFixed(0)}
						<div className="absolute -right-5 top-4 font-medium text-lg text-[var(--wc-temp)]">
							°C
						</div>
					</div>
				</div>

				<div className="mt-1 flex gap-3 text-xs font-light text-[var(--wc-subtext)]">
					<div>{`feels like ${data?.feelslike_temp_c?.toFixed(
						0
					)}°C`}</div>
					<div className="flex items-center">
						<GoTriangleUp className="w-3 h-3 text-[var(--wc-high-t)]" />
						<span>{data?.temp_max_c.toFixed(0)}°C</span>
					</div>
					<div className="flex items-center">
						<GoTriangleDown className="w-3 h-3 text-[var(--wc-low-t)]" />
						<span>{data?.temp_min_c.toFixed(0)}°C</span>
					</div>
				</div>
			</section>

			{/* weather cards */}
			<section>
				<div className="flex justify-around gap-3 sm:gap-5">
					<WeatherCardComponent
						stat="wind"
						value={data?.wind_speed}
						unit="mph"
					/>
					<WeatherCardComponent
						stat="rain"
						value={data?.rain_mm}
						unit="mm"
					/>
					<WeatherCardComponent
						stat="cloud"
						value={data?.clouds_percent}
						unit="%"
					/>
				</div>
			</section>

			{/* forecast cards */}
			<section>
				<div className="flex justify-around gap-5">
					{ forecastData.map((hourForecastData, idx) => (
						<WeatherCardForecastComponent key={idx} forecastData={hourForecastData} data={data} />
					))}
				</div>
			</section>

			{/* last updated time */}
			<section>
				<div className="text-xs font-mono mt-4 text-[var(--wc-subtext)]">
					{`Updated at 
					${getLocaleTimeString(
						data?.timestamp_dt,
						data?.location_country,
						data?.tz_id,
						{
							dateStyle: "medium",
							timeStyle: "short"
						}
					)}`}
				</div>
			</section>
		</div>
	);
};

export default WeatherCard;
