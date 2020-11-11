import Region from "./Region";
import YearStatistics from "./YearStatistics";

interface RegionStatistics{
    Region: Region;
    YearStatistics: Array<YearStatistics>;
}

export default RegionStatistics;