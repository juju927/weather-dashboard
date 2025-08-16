import axios from "axios";

const config = {
    baseUrl: "https://api.weatherapi.com/v1",
    Apikey: import.meta.env.VITE_WEATHER_API_KEY,
}

export const getCurrentWeather = async (query) => {
    try {
        const resp = await axios.get(`${config.baseUrl}/current.json`, {
            params: {
                key: config.Apikey,
                q: query,
                aqi: "no",
            }
        })

        return {
            status: resp.status,
            data: resp.data,
        }

    } catch (error) {
        console.log(error);
        return {
            status: error.status,
            data: error.response,
        }
    }
}
