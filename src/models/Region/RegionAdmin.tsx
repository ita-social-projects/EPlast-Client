import AdminType from '../Admin/AdminType';
import RegionUser from './RegionUser';

export default class RegionAdmin {
  id: number;
  userId: string;
  user: RegionUser;
  adminType: AdminType;
  regionId: number;
  startDate?: string;
  endDate?: string;
  AdminTypeId: number;

  constructor() {
    this.id = 0;
    this.userId = "";
    this.user = new RegionUser();
    this.adminType = new AdminType();
    this.regionId = 0;
    this.startDate = undefined;
    this.endDate = undefined;
    this.AdminTypeId = 0;
  }
}