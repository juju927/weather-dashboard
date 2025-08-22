const ForecastDay = ({ forecastDayData, isSelected, handleClick }) => {
	const getDay = (dateString) => {
		const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
		const dateObject = new Date(dateString);
		const dayIndex = dateObject.getDay();
		return weekdays[dayIndex];
	};

	return (
		<div
			className={`relative m-1 flex flex-col items-center lowercase text-md cursor-pointer ${
				isSelected
					? "text-[var(--wc-text)] font-semibold"
					: "text-[var(--wc-subtext)] font-light"
			} shrink-0`}
			onClick={handleClick}
		>
			<div>{getDay(forecastDayData.date)}</div>
			{/* <img
				className="h-8 w-8 md:h-12 md:w-12"
				src={forecastDayData.condition.icon}
				alt={forecastDayData.condition.text}
			/>
			<div>
				{forecastDayData.maxtemp_c}°/{forecastDayData.mintemp_c}°
			</div> */}
			<span
				className={`absolute left-0 -bottom-0.5 w-full h-0.5 bg-[var(--wcf-highlight)] origin-left transition-transform duration-300 group-hover:scale-x-100 ${
					isSelected ? "scale-x-100" : "scale-x-0"
				}`}
			></span>
		</div>
	);
};
export default ForecastDay;
