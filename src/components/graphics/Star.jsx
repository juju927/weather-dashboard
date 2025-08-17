const Star = ({ size = 2, x = "50%", y = "50%", className = "", duration = "2s", delay = "0s" }) => {
	return (
		<span
			aria-hidden="true"
			role="presentation"
			className={`absolute rounded-full bg-white opacity-90 pointer-events-none shadow-[0_0_8px_2px_rgba(255,255,255,0.35)] animate-twinkle ${className}`}
			style={{ width: size, height: size, left: x, top: y, "--d": duration, "--delay": delay }}
		/>
	);
};
export default Star;
