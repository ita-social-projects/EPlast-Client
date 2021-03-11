import Gender from "./Gender";
import User from "../UserTable/User";

export default class UserTable {
    id: string;
    firstName: string;
    lastName: string;
    birthday?: Date;
    gender: Gender;
    userProfileId: number;
    pseudo?: string;
    email: string;
    emailConfirmed: boolean;  
    regionName: string;
    cityName: string;
    clubName: string;
    userPlastDegreeName: string;
    userRoles: string;
    upuDegree: string;

    constructor() {
        this.id = "";
        this.firstName = "";
        this.lastName = "";
        this.birthday = undefined;
        this.gender = new Gender();
        this.userProfileId = 0;
        this.pseudo = "";
        this.email = "";
        this.emailConfirmed = false;
        this.regionName = "";
        this.cityName = "";
        this.clubName =  "";
        this.userPlastDegreeName = "";
        this.userRoles = "";
        this.upuDegree = "";
    }
}