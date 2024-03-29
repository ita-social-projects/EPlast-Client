interface RegionAnnualReport {
  numberOfSeatsPtashat: number;
  numberOfIndependentRiy: number;
  numberOfClubs: number;
  numberOfIndependentGroups: number;
  numberOfTeachers: number;
  numberOfAdministrators: number;
  numberOfTeacherAdministrators: number;
  numberOfBeneficiaries: number;
  numberOfPlastpryiatMembers: number;
  numberOfHonoraryMembers: number;
  numberOfPtashata: number;
  numberOfNovatstva: number;
  numberOfUnatstvaNoname: number;
  numberOfUnatstvaSupporters: number;
  numberOfUnatstvaMembers: number;
  numberOfUnatstvaProspectors: number;
  numberOfUnatstvaSkobVirlyts: number;
  numberOfSeniorPlastynSupporters: number;
  numberOfSeniorPlastynMembers: number;
  numberOfSeigneurSupporters: number;
  numberOfSeigneurMembers: number;
  annualReportId: number;
  annualReportDate: Date;
  annualReportYear: number;
  regionName: string;
  regionId: number;
  stateOfPreparation: string;
  characteristic: string;
  statusOfStrategy: string;
  involvementOfVolunteers: string;
  trainedNeeds: string;
  publicFunding: string;
  churchCooperation: string;
  socialProjects: string;
  problemSituations: string;
  importantNeeds: string;
  successStories: string;
  fundraising: string;
}

export default RegionAnnualReport;
