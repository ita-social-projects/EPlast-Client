import GoverningBodyAdmin from './GoverningBodyAdmin';

export default class GoverningBodyProfile {
  id: number;
  governingBodyName: string;
  logo: string | null;
  description: string;
  phoneNumber: string;
  email: string;


  constructor() {
    this.id = 0;
    this.governingBodyName = "";
    this.logo = "";
    this.description = "";
    this.phoneNumber = "";
    this.email = "";
  }
}
