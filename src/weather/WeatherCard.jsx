import { getLocaleTimeString } from "../helpers/common/parse";
import WeatherCardComponent from "./WeatherCardComponent";

const WeatherCard = ({ data }) => {
	return (
		<div className="relative z-10 w-full sm:w-4/5 max-w-2xl p-6 m-4 h-fit rounded-none sm:rounded-xl backdrop-blur-md bg-white/10 shadow-xl shadow-inner shadow-white/10 flex flex-col items-center text-center space-y-6">
			<div
				className="absolute inset-0 rounded-xl pointer-events-none -z-10"
				style={{
					boxShadow: "0 0 80px 15px rgba(255, 255, 255, 0.12)",
					filter: "blur(12px)",
					opacity: 0.6,
				}}
			/>
			{/* location name */}
			<section>
				<h1 className="text-center text-4xl sm:text-5xl font-semibold tracking-wide">
					{data?.location_country}
				</h1>
				<div className="text-lg text-slate-300">
					{data?.location_name}
				</div>
			</section>

			{/* temp & weather */}
			<section className="mt-5 w-fit space-y-1">
				<div className="flex items-start mx-3">
					<div className="relative text-6xl">
						{data?.temp_c.toFixed(1)}
						<div className="absolute -right-4 top-2 text-lg font-light">°C</div>
					</div>
				</div>

				<div className="text-slate-300 mt-1 text-xs font-light">
					{data?.temp_max_c.toFixed(0)}°C /{" "}
					{data?.temp_min_c.toFixed(0)}°C
				</div>

				<div className="text-xl font-semibold tracking-wide">
					{data?.weather_main}
				</div>
			</section>

			{/* weather cards */}
			<section>
				<div className="flex justify-around">
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

			{/* last updated time */}
			<section>
				<div className="text-slate-400 text-xs font-mono mt-4">
					Updated at {getLocaleTimeString(data?.timestamp_dt, data?.tz_offset, data?.location_country, data?.lat, data?.lon)}
				</div>
			</section>
		</div>
	);
};

export default WeatherCard;
