import AdminType from '../Admin/AdminType';
import ClubMember from './ClubMember';

export default class ClubAdmin {
  id: number;
  adminType: AdminType;
  startDate?: string;
  endDate?: string;
  clubId: number;
  clubMembers: ClubMember;

  constructor() {
    this.id = 0;
    this.clubMembers = new ClubMember();
    this.adminType = new AdminType();
    this.clubId = 0;
    this.startDate = undefined;
    this.endDate = undefined;
  }
}