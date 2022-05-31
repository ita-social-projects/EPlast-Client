type UserPrecautionTableItem = {
  id: number;
  precautionId: number;
  precautionName: string;
  reporter: string;
  reason: string;
  status: string;
  number: number;
  date: Date;
  endDate: Date;
  isActive: boolean;
  userId: string;
  userName: string;
};
export default UserPrecautionTableItem;
