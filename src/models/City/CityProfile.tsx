import CityAdmin from "./CityAdmin";

export default class CityProfile {
  id: number;
  name: string;
  logo: string | null;
  description: string;
  cityURL: string;
  phoneNumber: string;
  email: string;
  region: string;
  address: string;
  level: number;
  head: CityAdmin;
  headDeputy: CityAdmin;
  isActive: boolean;
  constructor() {
    this.id = 0;
    this.name = "";
    this.logo = "";
    this.description = "";
    this.cityURL = "";
    this.phoneNumber = "";
    this.email = "";
    this.region = "";
    this.address = "";
    this.level = 1;
    this.head = new CityAdmin();
    this.headDeputy = new CityAdmin();
    this.isActive = true;
  }
}
