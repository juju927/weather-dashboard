const Star = ({ size = 2, x = "50%", y = "50%", className = "" }) => {
	return (
		<span
			aria-hidden="true"
			role="presentation"
			className={`absolute rounded-full bg-white opacity-90 pointer-events-none shadow-[0_0_8px_2px_rgba(255,255,255,0.35)] ${className}`}
			style={{ width: size, height: size, left: x, top: y }}
		/>
	);
};
export default Star;
