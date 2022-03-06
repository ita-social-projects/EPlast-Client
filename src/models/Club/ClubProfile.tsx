import ClubAdmin from "./ClubAdmin";

export default class ClubProfile {
  id: number;
  name: string;
  logo: string | null;
  description: string;
  clubURL: string;
  phoneNumber: string;
  email: string;
  slogan: string;
  head: ClubAdmin;
  headDeputy: ClubAdmin;
  isActive: boolean;

  constructor() {
    this.id = 0;
    this.name = "";
    this.logo = "";
    this.description = "";
    this.clubURL = "";
    this.phoneNumber = "";
    this.email = "";
    this.slogan = "";
    this.head = new ClubAdmin();
    this.headDeputy = new ClubAdmin();
    this.isActive = true;
  }
}
