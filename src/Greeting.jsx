// this one for the next exercise lol

import { useState } from "react";

const Greeting = () => {
	const [isHi, setIsHi] = useState(true);
	return (
		<div className="flex flex-col items-center">
			{isHi ? "hello!" : "goodbye!"}
			<br />
			<button
				className="mt-2 px-3 py-1 bg-violet-300 text-black rounded-md"
				onClick={() => setIsHi(!isHi)}
			>
				{isHi ? "SEEYA" : "heyyyyy"}
			</button>
		</div>
	);
};
export default Greeting;
