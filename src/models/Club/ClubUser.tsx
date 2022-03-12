import { PlastDegree } from "../../api/activeMembershipApi";

export default class ClubUser {
  id: string;
  firstName: string;
  lastName: string;
  imagePath: string;
  email: string;
  phoneNumber: string;
  userRole: string;
  cityName: string;
  userPlastDegrees: any;
  cityMembers: any;
  clubReportCities: any;
  clubReportPlastDegrees: any;

  constructor() {
    this.id = "";
    this.firstName = "";
    this.lastName = "";
    this.imagePath = "";
    this.email = "";
    this.phoneNumber = "";
    this.userRole = "";
    this.cityName = "";
    this.userPlastDegrees = {
      plastDegree: { id: -1, name: "" },
    };
    this.cityMembers = {
      city: { id: -1, name: "" },
    };
    this.userPlastDegrees = {
      plastDegree: { id: -1, name: "" },
    };
    this.userPlastDegrees = {
      plastDegree: { id: -1, name: "" },
    };
  }
}
