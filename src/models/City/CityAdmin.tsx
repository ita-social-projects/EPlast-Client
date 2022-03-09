import AdminType from "../Admin/AdminType";
import CityUser from "./CityUser";

export default class CityAdmin {
  id: number;
  userId: string;
  user: CityUser;
  adminType: AdminType;
  cityId: number;
  startDate?: string;
  endDate?: string;

  constructor() {
    this.id = 0;
    this.userId = "";
    this.user = new CityUser();
    this.adminType = new AdminType();
    this.cityId = 0;
    this.startDate = undefined;
    this.endDate = undefined;
  }
}
