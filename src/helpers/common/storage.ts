const KEY = "coords";

export function saveCoords(lat: number, lon: number) {
    localStorage.setItem(KEY, JSON.stringify({ lat, lon }));
}

export function loadCoords(): { lat: number, lon: number } | null {
    const stored = localStorage.getItem(KEY);
    if (!stored) return null;

    try {
        const { lat, lon } = JSON.parse(stored);
        if (typeof lat === "number" && typeof lon === "number") {
            return { lat, lon };
        }
    } catch {}
    return null;
}

export function clearCoords() {
    localStorage.removeItem(KEY);
}