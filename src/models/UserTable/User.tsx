import Gender from "./Gender";

export default class User {
  id: string;
  firstName: string;
  lastName: string;
  birthday?: Date;
  gender: Gender;
  userProfileId: number;
  pseudo?: string;
  email: string;
  emailConfirmed: boolean;

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
  }
}
