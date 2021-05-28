interface RegionMembersInfo {
    CityAnnualReportId: number;
    CityId: number;
    ReportStatus: number;
    CityName: string;
    NumberOfSeatsPtashat: number;
    NumberOfIndependentRiy: number;
    NumberOfClubs: number;
    NumberOfIndependentGroups: number;
    NumberOfTeachers: number;
    NumberOfAdministrators: number;
    NumberOfTeacherAdministrators: number;
    NumberOfBeneficiaries: number;
    NumberOfPlastpryiatMembers: number;
    NumberOfHonoraryMembers: number;
    MembersStatistic: {
        NumberOfPtashata: number;
        NumberOfNovatstva: number;
        NumberOfUnatstva: number;
        NumberOfUnatstvaNoname: number;
        NumberOfUnatstvaSupporters: number;
        NumberOfUnatstvaMembers: number;
        NumberOfUnatstvaProspectors: number;
        NumberOfUnatstvaSkobVirlyts: number;
        NumberOfSenior: number;
        NumberOfSeniorPlastynSupporters: number;
        NumberOfSeniorPlastynMembers: number;
        NumberOfSeigneur: number;
        NumberOfSeigneurSupporters: number;
        NumberOfSeigneurMembers: number;
    }
}

export default RegionMembersInfo;