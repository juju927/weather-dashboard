import { LuWind } from "react-icons/lu";
import { MdOutlineWaterDrop } from "react-icons/md";
import { IoMdCloudOutline } from "react-icons/io";
import { TimeOfDay } from "../helpers/common/types";

const WeatherCardComponent = ({ stat, value, unit }) => {
	const STAT_ICONS = {
		wind: <LuWind className="h-5 w-5" />,
		rain: <MdOutlineWaterDrop className="h-5 w-5" />,
		cloud: <IoMdCloudOutline className="h-5 w-5" />,
	};
	return (
		<div className="w-fit py-2 px-4 flex flex-col shrink-0 text-center">
			<div className="flex justify-center items-center gap-0.5 text-sm">
				<div
					className={`${
						stat == "wind" && "text-[var(--wcc-wind)]"
					} ${
						stat == "rain" && "text-[var(--wcc-rain)]"
					} ${
						stat == "cloud" && "text-[var(--wcc-cloud)]"
					} gap-1 flex`}
				>
					{STAT_ICONS[stat]}
				    <span className="capitalize">{stat}</span>
				</div>
			</div>
			<span className="text-[var(--wc-text)]">{value}</span>
			<span className="text-xs text-light text-[var(--wc-subtext)]">{unit}</span>
		</div>
	);
};
export default WeatherCardComponent;
