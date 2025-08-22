import { useDebounce } from "@uidotdev/usehooks";
import { ThreeDot } from "react-loading-indicators";
import { useState, useEffect, useRef } from "react";
import { weatherApiClient } from "../../helpers/api/weatherApi/weatherApi.js";
import FocusTrap from "focus-trap-react";
import { FaLocationDot } from "react-icons/fa6";

const CountrySearchModal = ({
	isOpen,
	handleModalClose,
	handleSelectCountry,
	handleSelectCurrentLocation,
}) => {
	if (!isOpen) return null;

	const inputRef = useRef(null);
	const [selectedIdx, setSelectedIdx] = useState(0);
	const [searchInput, setSearchInput] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const debouncedSearchTerm = useDebounce(searchInput, 300);

	const handleKeyDown = async (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (searchResults.length > 0) {
				await handleSubmit();
			}
		}

		if (e.key === "Escape") {
			e.preventDefault();
			if (!isOpen) return;
			handleModalClose();
		}

		if (e.key === "ArrowDown") {
			e.preventDefault();
			if (selectedIdx < searchResults.length - 1) {
				setSelectedIdx(selectedIdx + 1);
			}
		}

		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (selectedIdx > 0) {
				setSelectedIdx(selectedIdx - 1);
			}
		}
	};

	const findLocation = async () => {
		setIsSearching(true);
		const resp = await weatherApiClient.searchForLocation(searchInput);
		if (resp.status === 200) {
			setSearchResults(resp.data);
		}
		setIsSearching(false);
	};

	const handleSubmit = async () => {
		if (selectedIdx > searchResults.length - 1) return;
		const { lat, lon } = searchResults[selectedIdx];
  		resetModal();
  		handleSelectCountry(lat, lon);
	};

	const resetModal = () => {
		setSearchInput("");
		setSearchResults([]);
		setSelectedIdx(0);
		handleModalClose();
		return;
	};

	useEffect(() => {
		if (!searchInput) {
			selectedIdx && setSelectedIdx(0);
			searchResults && setSearchResults([]);
			return;
		}
		findLocation();
	}, [debouncedSearchTerm]);

	useEffect(() => {
		if (isOpen) inputRef.current?.focus();
	}, [isOpen]);

	return (
		<div
			className="fixed inset-0 z-50 w-screen flex items-start justify-center bg-black/10 backdrop-blur-sm"
			role="dialog"
			aria-modal="true"
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) handleModalClose();
			}}
		>
			<FocusTrap
				active
				focusTrapOptions={{
					initialFocus: () => inputRef.current,
					returnFocusOnDeactivate: true,
					escapeDeactivates: false,
					clickOutsideDeactivates: true,
					allowOutsideClick: true,
					onPostActivate: () => inputRef.current?.focus(),
				}}
			>
				<div className="mt-30 max-h-4/5 w-4/5 max-w-3xl flex flex-col rounded-2xl bg-[var(--color-mocha-base)] text-[var(--color-mocha-text)] shadow-2xl ring-1 ring-white/10 overflow-hidden">
					{/* Top search row */}
					<div className="relative shrink-0 flex border-b border-[var(--color-mocha-overlay0)]">
						{/* magnifier */}
						<svg
							className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-mocha-lavender)]"
							viewBox="0 0 24 24"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M11 19a8 8 0 1 1 5.292-14.01A8 8 0 0 1 11 19Zm9.5 2-5-5"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>

						{/* input */}
						<input
							ref={inputRef}
							type="text"
							placeholder="Search for a city or country..."
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							className="h-12 w-full ml-12 mr-15 bg-transparent text-sm placeholder:text-[var(--color-mocha-lavender)] focus:outline-none"
							onKeyDown={handleKeyDown}
						/>

						{/* esc pill */}
						<div
							className="absolute right-3 top-1/2 -translate-y-1/2"
							onClick={() => handleModalClose()}
						>
							<span className="rounded-md border border-[var(--color-mocha-surface2)] bg-[var(--color-mocha-surface1)] px-2 py-1 text-[11px] leading-none tracking-wide text-[var(--color-mocha-subtext1)]">
								esc
							</span>
						</div>
					</div>

					{/* results */}
					<div className="grow bg-[var(--color-mocha-crust)]">
						{isSearching && (
							<div className="px-4 py-5 mx-auto flex justify-center">
								<ThreeDot
									color="#89b4fa"
									size="small"
									text=""
									textColor=""
								/>
							</div>
						)}

						{!isSearching &&
							searchResults.length > 0 &&
							searchResults.map((searchResultItem, idx) => (
								<div
									key={idx}
									className={`px-4 py-3 text-[var(--color-mocha-text)] ${
										idx === selectedIdx &&
										"bg-[var(--color-mocha-surface0)]"
									}`}
									onClick={(e) => {
										e.preventDefault();
										handleSubmit();
									}}
									onMouseOver={() => setSelectedIdx(idx)}
								>
									<span className="font-bold">
										{searchResultItem?.name}
									</span>
									{searchResultItem?.region &&
										`, ${searchResultItem?.region}`}
									{`, ${searchResultItem?.country}`}
								</div>
							))}

						{!isSearching && searchResults.length == 0 && (
							<div
								className={`px-4 py-3 flex items-center gap-2 text-[var(--color-mocha-text)] bg-[var(--color-mocha-surface0)]`}
								onClick={async (e) => {
									e.preventDefault();
									handleSelectCurrentLocation();
									resetModal();
								}}
							>
								<FaLocationDot />
								<span className="font-bold">
									Use current location
								</span>
							</div>
						)}
					</div>
					<div className="px-5 py-2 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between border-t border-[var(--color-mocha-overlay0)]">
						<span className="italic text-xs text-[var(--color-mocha-subtext0)]">
							Esc to close • ↑↓ to navigate • Enter to select
						</span>
						<span className="italic text-right text-xs text-[var(--color-mocha-subtext0)]">
							^^ search powered by{" "}
							<a
								href="https://www.weatherapi.com/"
								target="_blank"
							>
								<span className="text-[var(--color-mocha-teal)]">
									weatherAPI.com
								</span>
							</a>
						</span>
					</div>
				</div>
			</FocusTrap>
		</div>
	);
};
export default CountrySearchModal;
