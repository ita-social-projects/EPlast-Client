import { UserPrecautionStatus } from "./UserPrecaution";

type UserPrecautionTableInfo = {
  count: number;
  total: number;
  id: number;
  number: number;
  precautionName: string;
  userId: string;
  userName: string;
  reporter: string;
  reason: string;
  status?: UserPrecautionStatus;
  date: Date;
  endDate: Date;
  isActive: boolean;
};

export default UserPrecautionTableInfo;
