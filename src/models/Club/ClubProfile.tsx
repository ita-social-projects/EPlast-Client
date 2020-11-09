import ClubAdmin from './ClubAdmin';

export default class ClubProfile {
  id: number;
  name: string;
  logo: string | null;
  description: string;
  clubURL: string;
  phoneNumber: string;
  email: string;
  street: string;
  houseNumber: string;
  officeNumber: string;
  postIndex: string;
  head: ClubAdmin;

  constructor() {
    this.id = 0;
    this.name = "";
    this.logo = "";
    this.description = "";
    this.clubURL = "";
    this.phoneNumber = "";
    this.email = "";
    this.street = "";
    this.houseNumber = "";
    this.officeNumber = "";
    this.postIndex = "";
    this.head = new ClubAdmin();
  }
}