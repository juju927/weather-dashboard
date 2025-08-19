import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WeatherCard from "./weather/WeatherCard";
import { OrbitProgress } from "react-loading-indicators";
import { getTempConfig } from "./helpers/fun";
import {
	getForecastData,
	getWeatherData,
	WeatherApis,
} from "./helpers/api/common";
import Rain from "./components/graphics/Rain";
import Background from "./components/graphics/Background";
import { TimeOfDay } from "./helpers/common/types";
import { getTimeOfDay } from "./helpers/common/parse";
import { weatherApiClient } from "./helpers/api/weatherApi.ts";
import CountrySearchModal from "./components/search/CountrySearchModal";
import { loadCoords, saveCoords } from "./helpers/common/storage";

function App() {
	const [loading, setLoading] = useState(false);
	const [cardData, setCardData] = useState({});
	const [modalOpen, setModalOpen] = useState(() => !loadCoords());
	const [forecastData, setForecastData] = useState([]);
	const fetchTimerRef = useRef(null);

	const existsCardData = () => {
		return Object.keys(cardData).length > 0;
	};

	const scheduleNextFetch = (lat, lon) => {
		if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
		fetchTimerRef.current = window.setTimeout(() => {
			updateCardData(lat, lon);
			updateForecastData(lat, lon);
		}, 60 * 60 * 1000);
	};

	const updateCardData = useCallback(async (lat, lon) => {
		setLoading(true);
		try {
			// get data
			const weatherData = await getWeatherData(lat, lon);

			const timeZoneResp = await weatherApiClient.getTimeZone(lat, lon);
			if (timeZoneResp.status !== 200)
				throw new Error("Timezone fetch failed.");

			// set data
			setCardData((current) => ({
				...weatherData,
				tz_id: timeZoneResp.location?.tz_id,
			}));

			scheduleNextFetch(lat, lon);
		} catch (e) {
			console.error(e);
			setCardData({});
		} finally {
			setLoading(false);
		}
	}, []);

	const updateForecastData = useCallback(async (lat, lon) => {
		const respData = await getForecastData(
			lat,
			lon
		);
		setForecastData(respData);
	}, []);

	const handleSelectCountry = async (lat, lon) => {
		await updateCardData(lat, lon);
		await updateForecastData(lat, lon);
		saveCoords(lat, lon);
	};

	const handleSelectCurrentLocation = async () => {
		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				const { latitude, longitude } = pos.coords;
				await updateCardData(latitude, longitude);
				await updateForecastData(latitude, longitude);
				saveCoords(latitude, longitude);
			},
			(error) => {
				if (error.code === error.PERMISSION_DENIED) {
					console.error("User denied Geolocation access.");
				} else {
					console.error("Geolocation error: ", error.message);
				}
			}
		);
	};

	// get weather for last saved location on mount
	useEffect(() => {
		const savedCoords = loadCoords();
		if (savedCoords) {
			updateCardData(savedCoords.lat, savedCoords.lon);
			updateForecastData(savedCoords.lat, savedCoords.lon);
		}
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

	// cleanup on unmount
	useEffect(() => {
		return () => {
			if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
		};
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
					<WeatherCard
						data={cardData}
						timeOfDay={derivedTimeOfDay}
						handleModalOpen={() => setModalOpen(true)}
						forecastData={forecastData}
					/>
					<Background timeOfDay={derivedTimeOfDay} />
					<Rain precipitation={cardData?.rain_mm} />
				</>
			)}

			{!loading && !existsCardData() && (
				<Background timeOfDay={TimeOfDay.SUNSET} />
			)}
		</div>
	);
}

export default App;
