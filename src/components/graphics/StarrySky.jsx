import { useMemo } from "react";
import Star from "./Star";

const StarrySky = ({
	count = 80,
	minSize = 1,
	maxSize = 5,
	className = "fixed inset-0 z-[1] pointer-events-none",
}) => {

	const stars = useMemo(() => {
        // twinkle durations
        const MIN_DURATION = 1.6;
        const MAX_DURATION = 3.2;
		const rand = () => Math.random();
        const pick = (a, b) => a + rand() * (b - a);
		return Array.from({ length: count }, (_, i) => {
			const size = Math.round(minSize + rand() * (maxSize - minSize));
            const durSec = pick(MIN_DURATION, MAX_DURATION);
            const duration = `${durSec.toFixed(2)}s`;
            const delaySec = pick(0, durSec);
            const delay =`${delaySec.toFixed(2)}s`;
            
			return {
				id: i,
				x: `${rand() * 100}%`,
				y: `${rand() * 100}%`,
				size,
				opacity: 0.75 + rand() * 0.25,
				blur: size * 1.2,
                duration,
                delay
			};
		});
	}, [count, minSize, maxSize]);

	return (
		<div className={className}>
			{stars.map(({ id, x, y, size, opacity, blur }) => (
				<Star
					key={id}
					x={x}
					y={y}
					size={size}
					className={`opacity-[${opacity}] shadow-[0_0_${
						blur * 2
					}px_${blur}px_rgba(255,255,255,0.35)]`}
                    duration=""
				/>
			))}
		</div>
	);
};
export default StarrySky;
