import { CiCloudOn } from "react-icons/ci"
import { FaWind } from "react-icons/fa"
import { MdOutlineWaterDrop } from "react-icons/md"

const WeatherCardComponent = ({ stat, value, unit }) => {
    const STAT_ICONS = {
        wind: <FaWind />,
        rain: <MdOutlineWaterDrop />,
        cloud: <CiCloudOn />
    }
    return (
        <div className="w-fit py-2 px-4 flex flex-col shrink-0 text-center">
            <div className="flex justify-center items-center gap-0.5 text-sm">
                {STAT_ICONS[stat]}
                <span className="capitalize">{stat}</span>
            </div>
            <span className="text-md">{value}</span>
            <span className="text-xs text-light">{unit}</span>
        </div>
    )
}
export default WeatherCardComponent