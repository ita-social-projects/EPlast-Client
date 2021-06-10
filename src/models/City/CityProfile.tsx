import CityAdmin from './CityAdmin';

export default class CityProfile {
  id: number;
  name: string;
  logo: string | null;
  description: string;
  cityURL: string;
  phoneNumber: string;
  email: string;
  region: string;
  street: string;
  houseNumber: string;
  officeNumber: string;
  postIndex: string;
  head: CityAdmin;
  headDeputy: CityAdmin;

  constructor() {
    this.id = 0;
    this.name = "";
    this.logo = "";
    this.description = "";
    this.cityURL = "";
    this.phoneNumber = "";
    this.email = "";
    this.region = "";
    this.street = "";
    this.houseNumber = "";
    this.officeNumber = "";
    this.postIndex = "";
    this.head = new CityAdmin();
    this.headDeputy = new CityAdmin();
  }
}