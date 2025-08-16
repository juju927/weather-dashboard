import { useEffect, useState } from "react";
import { getCurrentWeather } from "./helpers/api/weatherApi";
import WeatherCard from "./weather/WeatherCard";
import { OrbitProgress } from "react-loading-indicators";
import { getTempConfig } from "./helpers/fun";
import Rain from "./components/rain/Rain";
import { getWeatherData, WeatherApis } from "./helpers/api/common";

import sample from "../data/sample.json";
import Background from "./components/rain/Background";
import { TimeOfDay } from "./helpers/common/types";
import { getTimeOfDay } from "./helpers/common/parse";

function App() {
	const [loading, setLoading] = useState(true);
	const [cardData, setCardData] = useState({});
	const [searchInvalid, setSearchInvalid] = useState(false);
	const [searchInput, setSearchInput] = useState("");

	const existsCardData = () => {
		return Object.keys(cardData).length > 0;
	};

	const fetchWeather = async (api, lat, lon) => {
		setCardData({});
		const resp = await getWeatherData(api, lat, lon);
		if (resp.status == 200) {
			console.log(resp);
			setCardData(resp.data);
		}
		setLoading(false);
	};

	const handleKeyDown = async (e) => {
		// if (e.key !== "Enter") {
		// 	setSearchInvalid(false);
		// 	return;
		// }

		// if (searchInput.length > 0 && searchInput.length < 3) {
		// 	setSearchInvalid(true);
		// 	return;
		// }

		setLoading(true);
		await fetchWeather(WeatherApis.OPEN_WEATHER_MAP_API, 35.9078, 127.7669);
		setSearchInput("");
	};

	useEffect(() => {
		// Get weather of current location on mount
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				fetchWeather(
					WeatherApis.OPEN_WEATHER_MAP_API,
					pos.coords.latitude,
					pos.coords.longitude
				);
			},
			(error) => {
				// If geolocation access not allowed, return singapore temperature on mount
				if (error.code === error.PERMISSION_DENIED) {
					console.error("User denied Geolocation access.");
					fetchWeather(
						WeatherApis.OPEN_WEATHER_MAP_API,
						39.0119, 98.4842
					);
				} else {
					console.error("Geolocation error: ", error.message);
				}
			}
		);
	}, []);

	return (
		<div className="relative w-screen h-screen flex flex-col items-center text-white overflow-auto bg-black">
			<h1 className="z-10 mt-10 mb-5 font-semibold text-3xl tracking-wider">
				today{" "}
				{existsCardData()
					? getTempConfig(cardData?.feelslike_temp_c).description
					: "weather how?"}
			</h1>

			<form
				className="z-10 w-72 mb-10"
				onSubmit={(e) => {
					e.preventDefault();
				}}
			>
				<input
					className="w-full mt-10 px-3 py-1 bg-neutral-800 rounded-sm"
					type="text"
					id="search"
					value={searchInput}
					autoComplete="off"
					placeholder="Enter a location"
					onChange={(e) => setSearchInput(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				{searchInvalid && (
					<span className="ml-1 text-sm text-light text-red-400 text-red">
						Location name too short.
					</span>
				)}
			</form>

			{loading && (
				<OrbitProgress
					dense
					color="#cc8ce8"
					size="small"
					text=""
					textColor=""
				/>
			)}
			{!loading && existsCardData() && (
				<>
					<WeatherCard data={cardData} />
					<Background
						timeOfDay={getTimeOfDay(
							cardData?.timestamp_dt,
							cardData?.local_sunrise_time,
							cardData?.local_sunset_time
						)}
					/>
					<Rain precipitation={cardData?.rain_mm} />
				</>
			)}

			{!loading && !existsCardData() && (
				<p>
					<i>Something went wrong - sorry :(</i>
				</p>
			)}
		</div>
	);
}

export default App;
