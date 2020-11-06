import StatisticsItem from "./StatisticsItem";

interface DataFromResponse{
    id: number,
    cityName:string,
    regionName: string,
    year: number,
    number: StatisticsItem [],
    numberOfPtashata: number,
    numberOfNovatstva: number,
    numberOfUnatstva: number,
    numberOfUnatstvaNoname: number,
    numberOfUnatstvaSupporters: number,
    numberOfUnatstvaMembers: number,
    numberOfUnatstvaProspectors: number,
    numberOfUnatstvaSkobVirlyts: number,
    numberOfSenior: number,
    numberOfSeniorPlastynSupporters: number,
    numberOfSeniorPlastynMembers: number,
    numberOfSeigneur: number,
    numberOfSeigneurSupporters: number,
    numberOfSeigneurMembers: number
}
export default DataFromResponse