import ClubUser from "./ClubUser";

export default class ClubMember {
  id: number;
  userId: string;
  user: ClubUser;
  ClubId: number;

  constructor() {
    this.id = 0;
    this.userId = "";
    this.user = new ClubUser();
    this.ClubId = 0;
  }
}
