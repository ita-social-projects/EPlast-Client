import GoverningBodyAdmin from './GoverningBodyAdmin';

export default class GoverningBodyProfile {
  id: number;
  description: string;
  email: string;
  governingBodyName: string;
  logo: string | null;
  phoneNumber: string;
  head: GoverningBodyAdmin;

  constructor() {
    this.id = 0;
    this.description = "";
    this.email = "";
    this.governingBodyName = "";
    this.logo = "";
    this.phoneNumber = "";
    this.head = new GoverningBodyAdmin();
  }
}
