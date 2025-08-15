import axios from "axios";

const config = {
    baseUrl: "http://api.weatherapi.com/v1",
    key: import.meta.env.VITE_WEATHER_API_KEY,
}

export const getCurrentWeather = async (query) => {
    try {
        const resp = await axios.get(`${config.baseUrl}/current.json`, {
            params: {
                key: config.key,
                q: query,
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