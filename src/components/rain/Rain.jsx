// https://codepen.io/aureliendotpro/pen/kVwyVe?editors=0110
// thank you aureliendotpro <3
import { useEffect, useState } from "react";

const randomRange = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

const Rain = ({ precipitation }) => {
	const [raindrops, setRaindrops] = useState([]);

	useEffect(() => {
		const drops = [];
		for (let i = 0; i < precipitation; i++) {
			drops.push({
				id: i,
				left: randomRange(0, window.innerWidth),
				top: randomRange(-1000, window.innerHeight),
			});
		}
		setRaindrops(drops);
	}, []);

	return (
		<div className="fixed inset-0 pointer-events-none z-0">
			{raindrops.map((drop) => (
				<div
					key={drop.id}
					className="absolute w-[1px] bg-gradient-to-b from-[#0d343a] to-white/60 animate-fall"
					style={{
                        height: `${Math.floor(precipitation/10 * 78)}px`,
						left: drop.left,
						top: drop.top,
						animationDuration: `${0.6 + Math.random() * 0.5}s`,
					}}
				/>
			))}
		</div>
	);
};
export default Rain;
