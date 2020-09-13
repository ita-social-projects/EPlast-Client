import Gender from "./Gender";
import User from "../UserTable/User";

export default class UserTable {
    user: User;
    regionName: string;
    cityName: string;
    clubName: string;
    userPlastDegreeName: string;
    userRoles: string;

    constructor() {
        this.user = new User();
        this.regionName = '';
        this.cityName = '';
        this.clubName = '';
        this.userPlastDegreeName = '';
        this.userRoles = '';
    }
}