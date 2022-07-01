export default class GoverningBodyUser {
  id: string;
  firstName: string;
  lastName: string;
  imagePath: string;
  email: string;
  phoneNumber: string;
  isInLowerRole: boolean;
  isInDeputyRole: boolean;

  constructor() {
    this.id = "";
    this.firstName = "";
    this.lastName = "";
    this.imagePath = "";
    this.email = "";
    this.phoneNumber = "";
    this.isInLowerRole = false;
    this.isInDeputyRole = false;
  }
}
