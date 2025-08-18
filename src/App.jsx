import { useEffect, useMemo, useState } from "react";
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
	const [modalOpen, setModalOpen] = useState(false);
	const [coords, setCoords] = useState({ lat: null, lon: null });

	const existsCardData = () => {
		return Object.keys(cardData).length > 0;
	};

	const fetchWeather = async (lat, lon) => {
		const resp = await getWeatherData(
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
			setCoords((current) => ({
				lat: lat,
				lon: lon,
			}));
		} catch (e) {
			console.error(e);
			setCardData({});
		} finally {
			setLoading(false);
		}
	};

	const handleSelectCurrentLocation = async () => {
		navigator.geolocation.getCurrentPosition((pos) => {
			handleSelectCountry(pos.coords.latitude, pos.coords.longitude);
		}, 
		(error) => {
			if (error.code === error.PERMISSION_DENIED) {
				console.error("User denied Geolocation access.");
			} else {
				console.error("Geolocation error: ", error.message);
			}
		})
	}

	// Get weather of current location on mount
	useEffect(() => {
		handleSelectCurrentLocation();
	}, []);

	// listen for button presses on mount
	useEffect(() => {
		const handleKeyDown = (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setModalOpen((prev) => true);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);




	// derived values for props
	const derivedTimeOfDay = useMemo(() => {
		if (!cardData) return null;
		return getTimeOfDay(
			cardData?.timestamp_dt,
			cardData?.local_sunrise_time,
			cardData?.local_sunset_time
		);
	}, [cardData]);

	return (
		<div className="relative w-dvw h-dvh flex flex-col items-center text-[var(--color-mocha-text)] overflow-auto bg-[var(--color-mocha-base)]">

			<CountrySearchModal
				isOpen={modalOpen}
				handleModalClose={() => setModalOpen(false)}
				handleSelectCountry={handleSelectCountry}
				handleSelectCurrentLocation={handleSelectCurrentLocation}
			/>

			{/* data */}
			{loading && (
				<div className="mt-10">
					<OrbitProgress
						dense
						color="#f9e2af"
						size="medium"
						text=""
						textColor=""
					/>
				</div>
			)}
			{!loading && existsCardData() && (
				<>
					<WeatherCard data={cardData} timeOfDay={derivedTimeOfDay} handleModalOpen={() => setModalOpen(true)} />
					<Background timeOfDay={derivedTimeOfDay} />
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
