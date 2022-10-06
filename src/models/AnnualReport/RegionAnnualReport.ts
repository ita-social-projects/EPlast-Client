import { ReportStatus } from "./ReportStatus";


export class RegionAnnualReport {
  id: number;
  date: Date;
  numberOfSeatsPtashat: number;
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
  numberOfIndependentRiy: number;
  numberOfClubs: number;
  numberOfIndependentGroups: number;
  numberOfTeachers: number;
  numberOfAdministrators: number;
  numberOfTeacherAdministrators: number;
  numberOfBeneficiaries: number;
  numberOfPlastpryiatMembers: number;
  numberOfHonoraryMembers: number;
  regionId: number;
  regionName: string;
  creatorId: string;
  stateOfPreparation: string;
  characteristic: string;
  statusOfStrategy: string;
  involvementOfVolunteers: string;
  trainedNeeds: string;
  publicFunding: string;
  churchCooperation: string;
  fundraising: string;
  socialProjects: string;
  problemSituations: string;
  importantNeeds: string;
  successStories: string;
  status: ReportStatus;

  constructor() {
    this.id = 0;
    this.date = new Date();
    this.numberOfSeatsPtashat = 0;
    this.numberOfPtashata = 0;
    this.numberOfNovatstva = 0;
    this.numberOfUnatstvaNoname = 0;
    this.numberOfUnatstvaSupporters = 0;
    this.numberOfUnatstvaMembers = 0;
    this.numberOfUnatstvaProspectors = 0;
    this.numberOfUnatstvaSkobVirlyts = 0;
    this.numberOfSeniorPlastynSupporters = 0;
    this.numberOfSeniorPlastynMembers = 0;
    this.numberOfSeigneurSupporters = 0;
    this.numberOfSeigneurMembers = 0;
    this.numberOfIndependentRiy = 0;
    this.numberOfClubs = 0;
    this.numberOfIndependentGroups = 0;
    this.numberOfTeachers = 0;
    this.numberOfAdministrators = 0;
    this.numberOfTeacherAdministrators = 0;
    this.numberOfBeneficiaries = 0;
    this.numberOfPlastpryiatMembers = 0;
    this.numberOfHonoraryMembers = 0;
    this.regionId = 0;
    this.regionName = '';
    this.creatorId = '';
    this.stateOfPreparation = '';
    this.characteristic = ''
    this.statusOfStrategy = '';
    this.involvementOfVolunteers = '';
    this.trainedNeeds = '';
    this.publicFunding = '';
    this.churchCooperation = '';
    this.fundraising = '';
    this.socialProjects = '';
    this.problemSituations = '';
    this.importantNeeds = '';
    this.successStories = '';
    this.status = 0;
  }
}

