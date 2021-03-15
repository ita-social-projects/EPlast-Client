import GoverningBodyAdmin from './GoverningBodyAdmin';

export default class GoverningBodyProfile {
  id: number;
  name: string;
  logo: string | null;
  description: string;
  governingBodyURL: string;
  phoneNumber: string;
  email: string;
  region: string;
  street: string;
  houseNumber: string;
  officeNumber: string;
  postIndex: string;
  head: GoverningBodyAdmin;

  constructor() {
    this.id = 0;
    this.name = "";
    this.logo = "";
    this.description = "";
    this.governingBodyURL = "";
    this.phoneNumber = "";
    this.email = "";
    this.region = "";
    this.street = "";
    this.houseNumber = "";
    this.officeNumber = "";
    this.postIndex = "";
    this.head = new GoverningBodyAdmin();
  }
}