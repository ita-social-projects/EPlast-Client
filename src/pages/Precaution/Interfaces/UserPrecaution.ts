import Precaution from "./Precaution";
import User from "../../Distinction/Interfaces/User";
import UserPrecautionStatus from "./UserPrecautionStatus";

type UserPrecaution = {
  id: number;
  precautionId: number;
  precaution: Precaution;
  reporter: string;
  reason: string;
  status: UserPrecautionStatus | null;
  number: number;
  date: Date;
  endDate: Date;
  isActive: boolean;
  userId: string;
  user: User;
};

export default UserPrecaution;
