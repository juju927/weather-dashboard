import { TimeOfDay } from "../../helpers/common/types";

type BackgroundProps = {
	timeOfDay?: TimeOfDay;
};

const Background = ({ timeOfDay = TimeOfDay.DAY }: BackgroundProps) => {
	return (
		<>
			{timeOfDay === TimeOfDay.DAY && (
				<div className="fixed inset-0 z-0 bg-gradient-to-b from-[#87CEFA] via-[#B0E0E6] to-[#E0FFFF]"></div>
			)}

			{timeOfDay === TimeOfDay.NIGHT && (
				<div className="fixed inset-0 z-0 bg-gradient-to-b from-[#110a48] via-[#12094c] via-[#251667] via-[#311f75] to-[#4f3098]"></div>
			)}

			{timeOfDay === TimeOfDay.SUNRISE && (
				<div className="fixed inset-0 z-0 bg-gradient-to-b from-[#ce3553] via-[#f57769] via-[#f8b171] to-[#f8d56d]"></div>
			)}

			{timeOfDay === TimeOfDay.SUNSET && (
				<div className="fixed inset-0 z-0 bg-gradient-to-b from-[#5b2d6d] via-[#a63271] via-[#ea4a62] to-[#ff7453]"></div>
			)}
		</>
	);
};

export default Background;
