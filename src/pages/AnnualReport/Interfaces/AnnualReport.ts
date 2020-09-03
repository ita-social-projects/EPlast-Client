import MembersStatistic from './MembersStatistic';
import User from './User';
import City from './City';

interface AnnualReport {
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
    creatorId: string;
    creator: User | null;
    newCityAdminId: string;
    newCityAdmin: User | null;
    newCityLegalStatusType: number;
    cityId: number;
    city: City | null;
}

export default AnnualReport;