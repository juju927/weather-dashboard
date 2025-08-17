import { useMemo } from "react";
import Star from "./Star";

const StarrySky = ({
	count = 50,
	minSize = 1,
	maxSize = 5,
	className = "fixed inset-0 z-[1] pointer-events-none",
}) => {
	// Generate positions/sizes once per mount
	const stars = useMemo(() => {
		const rand = () => Math.random();
		return Array.from({ length: count }, (_, i) => {
			const size = Math.round(minSize + rand() * (maxSize - minSize));
			return {
				id: i,
				x: `${rand() * 100}%`,
				y: `${rand() * 100}%`,
				size,
				// tiny brightness variance to avoid uniformity
				opacity: 0.75 + rand() * 0.25,
				blur: size <= 1 ? 2 : 3, // smaller stars get a tighter glow
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
				/>
			))}
		</div>
	);
};
export default StarrySky;
