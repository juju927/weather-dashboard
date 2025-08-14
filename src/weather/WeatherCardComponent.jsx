import { CiCloudOn } from "react-icons/ci"
import { FaWind } from "react-icons/fa"
import { MdOutlineWaterDrop } from "react-icons/md"

const WeatherCardComponent = ({ stat, value, unit }) => {
    const STAT_ICONS = {
        wind: <FaWind />,
        precipitation: <MdOutlineWaterDrop />,
        cloud: <CiCloudOn />
    }
    return (
        <div className="w-fit py-2 px-4 flex flex-col shrink-0 text-center">
            <div className="flex justify-center items-center gap-2">
                {STAT_ICONS[stat]}
                <span className="capitalize">{stat}</span>
            </div>
            <span className="text-2xl">{value}</span>
            <span className="text-xs text-light">{unit}</span>
        </div>
    )
}
export default WeatherCardComponent