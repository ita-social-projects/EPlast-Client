import User from "../UserTable/User";
import Distinction from "./Distinction";

export default class UserDistinction {
  id: number;
  distinctionId: number;
  distinction: Distinction;
  reporter: string;
  reason: string;
  number: number;
  date: Date;
  userId: string;
  user: User;

  constructor() {
    this.id = 0;
    this.distinctionId = 0;
    this.distinction = new Distinction();
    this.reporter = "";
    this.reason = "";
    this.number = 0;
    this.date = new Date();
    this.userId = "";
    this.user = new User();
  }
}
