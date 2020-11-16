import Region from "./Region";
import YearStatistics from "./YearStatistics";

interface RegionStatistics{
    region: Region;
    yearStatistics: Array<YearStatistics>;
}

export default RegionStatistics;