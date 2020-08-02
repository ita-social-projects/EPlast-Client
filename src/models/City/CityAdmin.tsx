import Admintype from '../Admin/AdminType';
import CityUser from './CityUser';

export default class CityAdmin {
  id: number;
  userId: string;
  user: CityUser;
  adminType: Admintype;
  cityId: number;
  startDate?: string;
  endDate?: string;

  constructor() {
    this.id = 0;
    this.userId = "";
    this.user = new CityUser();
    this.adminType = new Admintype();
    this.cityId = 0;
    this.startDate = undefined;
    this.endDate = undefined;
  }
}