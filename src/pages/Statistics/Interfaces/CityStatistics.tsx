import City from "./City";
import YearStatistics from "./YearStatistics";

interface CityStatistics{
    id: number,
    city: City,
    yearStatistics: Array<YearStatistics>,
}

export default CityStatistics;