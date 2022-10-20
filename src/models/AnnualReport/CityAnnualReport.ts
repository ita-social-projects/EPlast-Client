import { ReportStatus } from "./ReportStatus";

export class CityAnnualReport {
  id: number;
  date: Date;
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
  publicFunds: number;
  contributionFunds: number;
  plastSalary: number;
  sponsorshipFunds: number;
  listProperty: any;
  improvementNeeds: any;
  membersStatistic: any;
  creatorId: string;
  creatorFirstName: string;
  creatorLastName: string;
  creatorFatherName: string;
  newCityAdminId: string;
  newCityAdmin: any;
  newCityLegalStatusType: number;
  cityId: number;
  city: any;
  status: ReportStatus;

  constructor() {
    this.id = 0;
    this.date = new Date();
    this.numberOfSeatsPtashat = 0;
    this.numberOfIndependentRiy = 0;
    this.numberOfClubs = 0;
    this.numberOfIndependentGroups = 0;
    this.numberOfTeachers = 0;
    this.numberOfAdministrators = 0;
    this.numberOfTeacherAdministrators = 0;
    this.numberOfBeneficiaries = 0;
    this.numberOfPlastpryiatMembers = 0;
    this.numberOfHonoraryMembers = 0;
    this.publicFunds = 0;
    this.contributionFunds = 0;
    this.plastSalary = 0;
    this.sponsorshipFunds = 0;
    this.newCityAdminId = '';
    this.newCityAdmin = null;
    this.creatorId = '';
    this.creatorFirstName = '';
    this.creatorLastName = '';
    this.creatorFatherName = '';
    this.newCityLegalStatusType = 0;
    this.cityId = 0;
    this.city = null;
    this.status = 0;
  }
}

