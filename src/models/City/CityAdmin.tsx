import Admintype from '../Admin/AdminType';
import CityUser from './CityUser';

export default class CityAdmin {
  id: number;
  user: CityUser;
  adminType: Admintype;
  startDate: string;
  endDate: string;

  constructor() {
    this.id = 0;
    this.user = new CityUser();
    this.adminType = new Admintype();
    this.startDate = "0000-00-00";
    this.endDate = "0000-00-00";
  }
}