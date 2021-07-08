import AdminType from '../../Admin/AdminType';
import SectorUser from './SectorUser';

export default class SectorAdmin {
  id: number;
  userId: string;
  user: SectorUser;
  adminType: AdminType;
  sectorId: number;
  startDate?: string;
  endDate?: string;

  constructor() {
    this.id = 0;
    this.userId = "";
    this.user = new SectorUser();
    this.adminType = new AdminType();
    this.sectorId = 0;
    this.startDate = undefined;
    this.endDate = undefined;
  }
}
