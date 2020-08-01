import Admintype from '../Admin/AdminType';
import CityUser from './CityUser';

export default class CityAdmin {
  id: number;
  user: CityUser;
  adminType: Admintype;
  cityId: number;
  startDate: string;
  endDate: string;

  constructor() {
    this.id = 0;
    this.user = new CityUser();
    this.adminType = new Admintype();
    this.cityId = 0;
    this.startDate = "0001-01-01";
    this.endDate = "0001-01-01";
  }
}