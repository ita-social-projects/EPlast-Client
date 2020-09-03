import Admintype from '../Admin/AdminType';
import ClubUser from './ClubUser';

export default class ClubAdmin {
  id: number;
  userId: string;
  user: ClubUser;
  adminType: Admintype;
  clubId: number;
  startDate?: string;
  endDate?: string;

  constructor() {
    this.id = 0;
    this.userId = "";
    this.user = new ClubUser();
    this.adminType = new Admintype();
    this.clubId = 0;
    this.startDate = undefined;
    this.endDate = undefined;
  }
}