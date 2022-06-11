export default class RegionFollower {
  id: number;
  userId: string;
  appeal: string;
  cityName: string;
  cityDescription: string;
  logo: string | undefined;
  regionId: string;
  adress: string;
  level: number;
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
    this.adress = "";
    this.level = 1;
    this.cityURL = "";
    this.email = "";
    this.phoneNumber = "";
  }
}
