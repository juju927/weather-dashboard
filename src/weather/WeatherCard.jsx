import WeatherCardComponent from "./WeatherCardComponent";

const WeatherCard = ({ data }) => {
	const datetimeString = () => {
		const dateObj = new Date(`${data?.location?.localtime}:00`);
		return {
			date: dateObj.toLocaleDateString("en-US", {
				timeZone: data?.location?.tz_id,
				day: "numeric",
				month: "long",
				year: "numeric",
			}),
			dayTime: dateObj.toLocaleString("en-US", {
				timeZone: data?.location?.tz_id,
				weekday: "long",
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			}),
		};
	};

	return (
		<div className="md:w-108 p-4 h-fit m-2 bg-violet-300/70 border border-violet-200 rounded-md text-black">
			<section>
				<div className="flex">
					<div className="grow">
						<span className="block text-xl">
							{data?.location?.country},{" "}
							<b>{data?.location?.name}</b>
						</span>
						<span className="font-light">
							{data?.current?.condition?.text}
						</span>
					</div>
					<div className="text-sm text-right shrink-0 font-light mt-2">
						<span className="block">{datetimeString().date}</span>
						<span className="block">
							{datetimeString().dayTime}
						</span>
					</div>
				</div>

				<div className="flex items-center mt-2">
					<img
						className="w-10 h-10"
						src={data?.current?.condition?.icon}
					/>
					<span className="text-6xl mr-1">
						{data?.current?.temp_c}
					</span>
					<span className="text-xl font-light mb-4">°C</span>
				</div>
			</section>
			<hr className="m-4 border-violet-300" />
			<section>
				<div className="flex justify-around">
					<WeatherCardComponent
						stat="wind"
						value={data?.current?.wind_kph}
						unit="km/h"
					/>
					<WeatherCardComponent
						stat="precipitation"
						value={data?.current?.precip_mm}
						unit="mm"
					/>
					<WeatherCardComponent
						stat="cloud"
						value={data?.current?.cloud}
						unit="%"
					/>
				</div>
			</section>
		</div>
	);
};

export default WeatherCard;
