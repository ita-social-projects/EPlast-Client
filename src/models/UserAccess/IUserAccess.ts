export default interface IUserAnnualReportAccess {
    IsSuperAdmin: boolean;
    IsAdmin: boolean;
    CanViewAnnualReportsTable: boolean;
    CanFindEveryAnnualReportInSearch: boolean;
    CanViewEveryAnnualReport: boolean;
    CanSubmitCityReport: boolean;
    CanSubmitClubReport: boolean;
    CanSubmitRegionReport: boolean;
    CanEditReport: boolean;
    CanChangeReportStatus: boolean;
    CanDeleteReport: boolean;
}
export default interface IUserStatisticsAccess {
    IsAdmin: boolean;
    CanCityStatisticsChooseCity: boolean;
    CanCityStatisticsChooseYears: boolean;
    CanCityStatisticsChooseIndicators: boolean;
    CanCityStatisticsFormReport: boolean;
    CanRegionStatisticsChooseRegion: boolean;
    CanRegionStatisticsСhooseYears: boolean;
    CanRegionStatisticsChooseIndicators: boolean;
    CanRegionStatisticsFormReport: boolean;
}