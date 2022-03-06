import distinction from "./Distinction";
import User from "./User";
type UserDistinction = {
  id: number;
  distinctionId: number;
  distinction: distinction;
  reporter: string;
  reason: string;
  number: number;
  date: Date;
  userId: string;
  user: User;
};
export default UserDistinction;
