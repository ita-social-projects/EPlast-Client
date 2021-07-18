export default class RegionFollower {
  id: number;
  userId: string;
  appeal: string;
  cityName: string;
  cityDescription: string;
  logo: string | undefined;
  regionId: string;
  street: string;
  houseNumber: string;
  officeNumber: string;
  postIndex: string;
  cityURL: string;
  email: string;
  phoneNumber: string;

  constructor() {
    this.id = 0;
    this.userId = "";
    this.appeal = "";
    this.cityName = "";
    this.cityDescription = "";
    this.logo = "";
    this.regionId = "";
    this.street = "";
    this.houseNumber = "";
    this.officeNumber = "";
    this.postIndex = "";
    this.cityURL = "";
    this.email = "";
    this.phoneNumber = "";
  }
}