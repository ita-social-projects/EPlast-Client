import Gender from "./Gender";

export default class ShortUserInfo {
  id: string;
  userProfileId: number;
  firstName: string;
  lastName: string;
  birthday?: Date;
  gender: Gender;
  imagePath: string;
  email: string;
  emailConfirmed: boolean;
  isInLowerRole: boolean;
  isInDeputyRole: boolean;

  constructor() {
    this.id = "";
    this.userProfileId = 0;
    this.firstName = "";
    this.lastName = "";
    this.birthday = undefined;
    this.gender = new Gender();
    this.userProfileId = 0;
    this.imagePath = "";
    this.email = "";
    this.emailConfirmed = false;
    this.isInLowerRole = false;
    this.isInDeputyRole = false;
  }
}
