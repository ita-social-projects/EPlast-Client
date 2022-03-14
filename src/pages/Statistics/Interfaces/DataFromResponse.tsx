import StatisticsItem from "./StatisticsItem";

interface DataFromResponse {
  id: number;
  cityName: string;
  regionName: string;
  year: number;
  number: StatisticsItem[];
}
export default DataFromResponse;
