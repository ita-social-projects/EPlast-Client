import AdminType from "../Admin/AdminType";
import ClubUser from "./ClubUser";

export default class ClubAdmin {
  id: number;
  userId: string;
  user: ClubUser;
  adminType: AdminType;
  clubId: number;
  startDate?: string;
  endDate?: string;

  constructor() {
    this.id = 0;
    this.userId = "";
    this.user = new ClubUser();
    this.adminType = new AdminType();
    this.clubId = 0;
    this.startDate = undefined;
    this.endDate = undefined;
  }
}
