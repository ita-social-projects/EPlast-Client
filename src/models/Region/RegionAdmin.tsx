import AdminType from "../Admin/AdminType";
import CityUser from "../City/CityUser";
import RegionProfile from "./RegionProfile";

export default class RegionAdmin {
  id: number;
  userId: string;
  user: CityUser;
  cityId: number;
  adminTypeId: number;
  adminType: AdminType;
  startDate?: string;
  endDate?: string;
  regionId: number;
  region: RegionProfile;
  status: boolean;

  constructor() {
    this.id = 0;
    this.userId = "";
    this.user = new CityUser();
    this.cityId = 0;
    this.adminTypeId = 0;
    this.adminType = new AdminType();
    this.startDate = undefined;
    this.endDate = undefined;
    this.regionId = 0;
    this.region = new RegionProfile();
    this.status = false;
  }
}
