import SectorAdmin from './SectorAdmin';

export default class SectorProfile {
  id: number;
  governingBodyId: number;
  description: string;
  email: string;
  name: string;
  logo: string | null;
  phoneNumber: string;
  head: SectorAdmin;

  constructor() {
    this.id = 0;
    this.governingBodyId = 0;
    this.description = "";
    this.email = "";
    this.name = "";
    this.logo = "";
    this.phoneNumber = "";
    this.head = new SectorAdmin();
  }
}
