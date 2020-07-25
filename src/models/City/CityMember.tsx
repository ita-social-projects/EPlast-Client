import CityUser from "./CityUser";

export default class CityMember {
  id: number;
  user: CityUser;

  constructor() {
    this.id = 0;
    this.user = new CityUser();
  }
}
