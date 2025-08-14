import axios from "axios";

const config = {
    baseUrl: "http://api.weatherapi.com/v1",
    key: "59232b78b0ec465bb6c42626251308",
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