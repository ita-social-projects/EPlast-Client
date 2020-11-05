import CityStatistics from "../../Interfaces/CityStatistics";
import StatisticsItemIndicator from "../../Interfaces/StatisticsItemIndicator";

interface Props {
    record: CityStatistics;
    pageX: number;
    pageY: number;
    showDropdown: boolean;
    onView: (CityStatistics: CityStatistics) => Promise<void>;
}

export default Props;