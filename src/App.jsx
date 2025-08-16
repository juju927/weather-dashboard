import { useEffect, useState } from "react";
import { getCurrentWeather } from "./helpers/api/weatherApi";
import WeatherCard from "./weather/WeatherCard";
import { OrbitProgress } from "react-loading-indicators";
import { getTempConfig } from "./helpers/fun";
import Rain from "./components/rain/Rain";
import { getWeatherData, WeatherApis } from "./helpers/api/common";

import sample from "../data/sample.json"

function App() {
	const [loading, setLoading] = useState(true);
	const [cardData, setCardData] = useState({});
	const [searchInvalid, setSearchInvalid] = useState(false);
	const [searchInput, setSearchInput] = useState("");

	const existsCardData = () => {
		return Object.keys(cardData).length > 0;
	}

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
		if (e.key !== "Enter") {
			setSearchInvalid(false);
			return;
		}

		if (searchInput.length > 0 && searchInput.length < 3) {
			setSearchInvalid(true);
			return;
		}

		setLoading(true);
		await fetchWeather(searchInput);
		setSearchInput("");
	};

	useEffect(() => {
		// Get weather of current location on mount
		navigator.geolocation.getCurrentPosition((pos) => {
			fetchWeather(WeatherApis.OPEN_WEATHER_MAP_API, pos.coords.latitude, pos.coords.longitude)
		},
		(error) => {
			// If geolocation access not allowed, return singapore temperature on mount 
			if (error.code === error.PERMISSION_DENIED) {
				console.error("User denied Geolocation access.");
				fetchWeather(WeatherApis.OPEN_WEATHER_MAP_API, 1.3521, 103.8198)
			} else {
				console.error("Geolocation error: ", error.message)
			}
		})
	}, [])

	return (
		<div className="relative w-screen h-screen flex flex-col items-center text-white overflow-auto bg-black">
			<h1 className="mt-10 mb-5 font-semibold text-3xl tracking-wider">
				today {" "}
				{ existsCardData() ? getTempConfig(cardData?.feelslike_temp_c).description : "weather how?" }
			</h1>

			<form
				className="w-72 mb-10"
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
			{!loading && existsCardData() && (<WeatherCard data={cardData} />)}

			{!loading && !existsCardData() && (<p><i>Something went wrong - sorry :(</i></p>)}

			<Rain precipitation={cardData?.rain_mm} />

			<div className="absolute inset-x-0 bottom-0 h-2/5">
				<div className={`absolute inset-0 bg-gradient-to-t ${getTempConfig(cardData?.feelslike_temp_c)?.color} to-black/0 transition-colors ease-in-out`}></div>
			</div>
		</div>
	);
}

export default App;
