import UserPrecautionStatus from "./UserPrecautionStatus";

type UserPrecautionEdit = {
  id: number;
  precautionId: number;
  reporter: string;
  reason: string;
  status: UserPrecautionStatus;
  number: number;
  date: Date;
  userId: string;
};

export default UserPrecautionEdit;
