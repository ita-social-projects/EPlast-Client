import Precaution from "./Precaution";
import User from "../../Distinction/Interfaces/User";

interface UserPrecaution {
  id: number;
  precautionId: number;
  precaution: Precaution;
  reporter: string;
  reason: string;
  status?: UserPrecautionStatus;
  number: number;
  date: Date;
  endDate: Date;
  isActive: boolean;
  userId: string;
  user: User;
};

export enum UserPrecautionStatus
{ 
    Accepted,
    Confirmed,  
    Canceled
}

export default UserPrecaution;
