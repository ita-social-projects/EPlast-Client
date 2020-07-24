import { MembersStatistic } from './MembersStatistic';
import { CityManagement } from './CityManagement';
import { User } from './User';
import { City } from './City';

export class AnnualReport {
    id: number;
    date: Date;
    status: number;
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
    listProperty: string;
    improvementNeeds: string;
    membersStatistic: MembersStatistic;
    cityManagement: CityManagement;
    userId: string = '';
    user: User | null = null;
    cityId: number = 0;
    city: City | null = null;

    constructor(obj: any) {
        this.id = 0;
        this.date = new Date();
        this.status = 0;
        this.numberOfSeatsPtashat = obj.numberOfSeatsPtashat;
        this.numberOfIndependentRiy = obj.numberOfIndependentRiy;
        this.numberOfClubs = obj.numberOfClubs;
        this.numberOfIndependentGroups = obj.numberOfIndependentGroups;
        this.numberOfTeachers = obj.numberOfTeachers;
        this.numberOfAdministrators = obj.numberOfAdministrators;
        this.numberOfTeacherAdministrators = obj.numberOfTeacherAdministrators;
        this.numberOfBeneficiaries = obj.numberOfBeneficiaries;
        this.numberOfPlastpryiatMembers = obj.numberOfPlastpryiatMembers;
        this.numberOfHonoraryMembers = obj.numberOfHonoraryMembers;
        this.publicFunds = obj.publicFunds;
        this.contributionFunds = obj.contributionFunds;
        this.plastSalary = obj.plastSalary;
        this.sponsorshipFunds = obj.sponsorshipFunds;
        this.listProperty = obj.listProperty;
        this.improvementNeeds = obj.improvementNeeds;
        this.membersStatistic = new MembersStatistic(obj);
        this.cityManagement = new CityManagement(obj);
        this.userId = '';
        this.user = null;
        this.cityId = 0;
        this.city = null;
    }
}