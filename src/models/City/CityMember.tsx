import CityUser from "./CityUser";

export default class CityMember {
  id: number;
  userId: string;
  user: CityUser;
  cityId: number;
  wasInRegisteredUserRole: boolean;

  constructor() {
    this.id = 0;
    this.userId = "";
    this.user = new CityUser();
    this.cityId = 0;
    this.wasInRegisteredUserRole = false;
  }
}
