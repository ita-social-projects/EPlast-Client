export default class RegionBoardProfile {
  id: number;
  regionName: string;
  logo: string | null;
  description: string;
  link: string;
  phoneNumber: string;
  email: string;
  city: string;
  street: string;
  houseNumber: string;
  officeNumber: string;
  postIndex: string;

  constructor() {
    this.id = 0;
    this.regionName = "";
    this.logo = "";
    this.description = "";
    this.link = "";
    this.phoneNumber = "";
    this.email = "";
    this.city = "";
    this.street = "";
    this.houseNumber = "";
    this.officeNumber = "";
    this.postIndex = "";
  }
}
