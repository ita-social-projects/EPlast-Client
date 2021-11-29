export default interface IUserAnnualReportAccess {
    IsAdmin: boolean;
    ViewAnnualReportsTable: boolean;
    FindEveryAnnualReportInSearch: boolean;
    ViewEveryAnnualReport: boolean;
    SubmitCityReport: boolean;
    SubmitClubReport: boolean;
    SubmitRegionReport: boolean;
    EditReport: boolean;
    ChangeReportStatus: boolean;
    DeleteReport: boolean;
}
export default interface IUserStatisticsAccess {
    IsAdmin: boolean;
    CityStatisticsChooseCity: boolean;
    CityStatisticsChooseYears: boolean;
    CityStatisticsChooseIndicators: boolean;
    CityStatisticsFormReport: boolean;
    RegionStatisticsChooseRegion: boolean;
    RegionStatisticsСhooseYears: boolean;
    RegionStatisticsChooseIndicators: boolean;
    RegionStatisticsFormReport: boolean;
}
