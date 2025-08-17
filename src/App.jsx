import { useEffect, useState } from "react";
import WeatherCard from "./weather/WeatherCard";
import { OrbitProgress } from "react-loading-indicators";
import { getTempConfig } from "./helpers/fun";
import { getWeatherData, WeatherApis } from "./helpers/api/common";
import Rain from "./components/graphics/Rain";
import Background from "./components/graphics/Background";

import sample from "../data/sample.json";
import { TimeOfDay } from "./helpers/common/types";
import { getTimeOfDay } from "./helpers/common/parse";
import { weatherApiClient } from "./helpers/api/weatherApi.ts";
import CountrySearchModal from "./components/search/CountrySearchModal";

function App() {
	const [loading, setLoading] = useState(true);
	const [cardData, setCardData] = useState({});
	const [modalOpen, setModalOpen] = useState(true);

	const existsCardData = () => {
		return Object.keys(cardData).length > 0;
	};

	const fetchWeather = async (lat, lon) => {
		const resp = await getWeatherData(
			WeatherApis.OPEN_WEATHER_MAP_API,
			lat,
			lon
		);
		if (resp.status == 200) return resp.data;
		throw new Error("Weather fetch failed.");
	};

	const fetchTimeZone = async (lat, lon) => {
		const resp = await weatherApiClient.getTimeZone(lat, lon);
		if (resp.status == 200) return resp.data;
		throw new Error("Timezone fetch failed.");
	};

	const handleSelectCountry = async (lat, lon) => {
		try {
			// get the timeZone
			const timeZoneResp = await fetchTimeZone(lat, lon);
			const tz_id = timeZoneResp?.location?.tz_id;
			
			// get the weather
			const weatherResp = await fetchWeather(lat, lon);
			setCardData((current) => ({
				...weatherResp,
				tz_id: tz_id,
			}));
		} catch (e) {
			console.error(e);
			setCardData({})
		} finally {
			setLoading(false);
		}
	};

	// Get weather of current location on mount
	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				handleSelectCountry(
					pos.coords.latitude,
					pos.coords.longitude
				);
			},
			(error) => {
				// If geolocation access not allowed, return singapore temperature on mount
				if (error.code === error.PERMISSION_DENIED) {
					console.error("User denied Geolocation access.");
					handleSelectCountry(
						1.250111,
						103.830933
					);
				} else {
					console.error("Geolocation error: ", error.message);
				}
			}
		);
	}, []);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setModalOpen((prev) => true);
			};
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [])

	return (
		<div
			className="relative w-screen h-screen flex flex-col items-center text-white overflow-auto bg-black"
		>
			<h1 className="z-10 mt-10 mb-5 font-semibold text-3xl tracking-wider">
				today{" "}
				{existsCardData()
					? getTempConfig(cardData?.feelslike_temp_c)?.description
					: "weather how?"}
			</h1>

			<CountrySearchModal
				isOpen={modalOpen}
				handleModalClose={() => setModalOpen(false)}
				countries={["singapore", "malaysia", "china"]}
				handleSelectCountry={handleSelectCountry}
			/>

			{/* data */}
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
