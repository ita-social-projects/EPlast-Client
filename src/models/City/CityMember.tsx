import CityUser from "./CityUser";

export default class CityMember {
  id: number;
  user: CityUser;
  cityId: number;

  constructor() {
    this.id = 0;
    this.user = new CityUser();
    this.cityId = 0;
  }
}