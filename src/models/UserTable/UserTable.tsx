import Gender from "./Gender";
import User from "../UserTable/User";
import UkraineOblasts from "../Oblast/UkraineOblasts";

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
  address: string;
  phoneNumber: string;
  oblast: UkraineOblasts;
  referal: string;
  userPlastDegreeName: string;
  userRoles: string;
  upuDegree: string;
  comment: string;
  isCityFollower: boolean;
  isClubFollower: boolean;

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
    this.clubName = "";
    this.address = "";
    this.phoneNumber = "";
    this.oblast = UkraineOblasts.NotSpecified;
    this.referal = "";
    this.userPlastDegreeName = "";
    this.userRoles = "";
    this.upuDegree = "";
    this.comment = "";
    this.isCityFollower = false;
    this.isClubFollower = false;
  }
}
