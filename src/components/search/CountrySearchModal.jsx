import { useDebounce } from "@uidotdev/usehooks";
import { OrbitProgress } from "react-loading-indicators";
import { useState, useEffect } from "react";
import { weatherApiClient } from "../../helpers/api/weatherApi.ts";

const CountrySearchModal = ({
	isOpen,
	handleModalClose,
	countries,
	onSelect,
    handleSelectCountry
}) => {
    if (!isOpen) return null;
	
    const [selectedIdx, setSelectedIdx] = useState(0);
	const [searchInput, setSearchInput] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	const debouncedSearchTerm = useDebounce(searchInput, 300);

	const handleKeyDown = async (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (searchResults.length > 0) {
				await handleSubmit()
			}
		}

		if (e.key === "Escape") {
			e.preventDefault();
			if (!open) return;
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
			console.log(resp);
			setSearchResults(resp.data);
		}
		setIsSearching(false);
	};

    const handleSubmit = async () => {
        if (selectedIdx > searchResults.length - 1) return;
        await handleSelectCountry(searchResults[selectedIdx].lat, searchResults[selectedIdx].lon);
        setSearchInput("");
        setSearchResults([]);
        setSelectedIdx(0);
        handleModalClose();
        return;
    }

	useEffect(() => {
		if (!searchInput) {
            selectedIdx && setSelectedIdx(0);
            searchResults && setSearchResults([]);
            return;
        };
		findLocation();
	}, [debouncedSearchTerm]);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
			<div className="w-full max-h-4/5 max-w-3xl flex flex-col rounded-2xl bg-slate-800 text-slate-200 shadow-2xl ring-1 ring-white/10 overflow-hidden">
				{/* Top search row */}
				<div className="relative shrink-0 flex border-b border-slate-300">
					{/* magnifier */}
					<svg
						className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
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
						autoFocus
						type="text"
						placeholder="Search for a city or country..."
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						className="h-12 w-full ml-12 mr-15 bg-transparent placeholder:text-slate-400 focus:outline-none"
						onKeyDown={handleKeyDown}
					/>

					{/* esc pill */}
					<div className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => handleModalClose()}>
						<span className="rounded-md border border-slate-600/60 bg-slate-700/60 px-2 py-1 text-[11px] leading-none tracking-wide text-slate-300">
							esc
						</span>
					</div>
				</div>

				{/* results */}
				<div className="grow bg-slate-900 px-5 py-2">
					{ isSearching && (
						<OrbitProgress
							dense
							color="#cc8ce8"
							size="small"
							text=""
							textColor=""
							className="self-center"
						/>
					)}

                    { !isSearching && searchResults.length > 0 && (
                        searchResults.map((searchResultItem, idx) => (
							<div
								autoFocus
								key={idx}
								className={`my-2 px-2 py-3 rounded-lg text-white ${idx === selectedIdx && "bg-violet-500"}`}
                                onClick={(e) => { 
                                    handleSubmit();
                                }}
                                onMouseOver={() => setSelectedIdx(idx)}
							>
                                <span className="font-bold">{searchResultItem?.name}</span>
								{ searchResultItem?.region && `, ${searchResultItem?.region}` }
								{`, ${searchResultItem?.country}`}
							</div>
						))
                    )}

                    { !isSearching && searchResults.length === 0 && (
                        <div className="h-24 italic text-sm">
								where are we going?
							</div>
                    )}
				</div>
				<div className="px-5 py-2 text-right italic border-t border-slate-300">
					^^ ~
				</div>
			</div>
		</div>
	);
};
export default CountrySearchModal;
