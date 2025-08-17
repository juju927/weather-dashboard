// https://codepen.io/aureliendotpro/pen/kVwyVe?editors=0110
// thank you aureliendotpro <3
import { useEffect, useState } from "react";

const randomRange = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

const numDrops = (precip) => {
    if (precip == null) return 0;
    if (precip < 0.1) return 0;
    if (precip < 0.5) return 10;
    if (precip < 2.5) return 20;
    if (precip < 10) return 50;
    if (precip < 50) return 100;
    return 150
};

const Rain = ({ precipitation }) => {
	const [raindrops, setRaindrops] = useState([]);

	useEffect(() => {
		const drops = [];
		for (let i = 0; i < numDrops(precipitation) ; i++) {
			drops.push({
				id: i,
				left: randomRange(0, window.innerWidth),
				top: randomRange(-1000, window.innerHeight),
			});
		}
		setRaindrops(drops);
	}, [precipitation]);

	return (
		<div className="fixed inset-0 pointer-events-none z-0">
			{raindrops.map((drop) => (
				<div
					key={drop.id}
					className="absolute w-[1px] bg-gradient-to-b from-[#0d343a] to-white/60 animate-fall"
					style={{
                        height: `${Math.max(20, Math.floor(numDrops(precipitation)/150 * 78))}px`,
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
