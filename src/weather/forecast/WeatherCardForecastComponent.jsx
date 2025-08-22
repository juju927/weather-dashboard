import { useState } from "react";
import { getLocaleTimeString } from "../../helpers/common/parse";
import ForecastDay from "./ForecastDay";
import ForecastHour from "./ForecastHour";

const WeatherCardForecastComponent = ({ forecastData }) => {
	const [selectedDayIndex, setSelectedDayIndex] = useState(0);

	return (
		<>
			<div className="flex justify-center">
				{forecastData?.forecast?.day?.map((forecastDayData, idx) => (
					<ForecastDay
						key={`fc-day-${idx}`}
						forecastDayData={forecastDayData}
						isSelected={idx == selectedDayIndex}
						handleClick={() => setSelectedDayIndex(idx)}
					/>
				))}
			</div>

			<div className="mt-2 md:mt-4 pb-4 flex justify-around gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
				{forecastData?.forecast?.day?.[selectedDayIndex]?.hour
					.filter((_, idx) => idx % 3 === 0)
					.map((forecastHourData, idx) => (
						<ForecastHour
							key={`fc-hour-${idx}`}
							forecastHourData={forecastHourData}
						/>
					))}
			</div>
		</>
	);
};
export default WeatherCardForecastComponent;
