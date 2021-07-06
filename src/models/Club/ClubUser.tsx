export default class ClubUser {
  id: string;
  firstName: string;
  lastName: string;
  imagePath: string;
  email: string;
  phoneNumber:string;
  userRole: string;
  cityName: string;
  plastDegree:{
    id: number;
    name:string;
  };

  constructor() {
    this.id = "";
    this.firstName = "";
    this.lastName = "";
    this.imagePath = "";
    this.email = "";
    this.phoneNumber = "";
    this.userRole = '';
    this.cityName = '';
    this.plastDegree={id:-1, name:"None"}
  }
}
