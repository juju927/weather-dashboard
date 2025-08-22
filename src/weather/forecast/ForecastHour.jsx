const ForecastHour = ({ forecastHourData }) => {
    const getHour = (dateString) => {
        const dateObject = new Date(dateString.replace(" ", "T"));
        return dateObject.toLocaleTimeString([], {
            hour: 'numeric',
            hour12: true
        });
    }

	return (
		<div className="flex flex-col items-center uppercase font-light text-xs text-[var(--wc-subtext)] shrink-0">
			<img
				className="h-8 w-8 md:h-12 md:w-12"
				src={forecastHourData.condition.icon}
				alt={forecastHourData.condition.text}
                />
            <div>{ getHour(forecastHourData.time) }</div>
		</div>
	);
};
export default ForecastHour;
