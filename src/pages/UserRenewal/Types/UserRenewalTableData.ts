type UserRenewalTableData = {
  id: number;
  subtotal: number;
  total: number;
  userId: string;
  userName: string;
  cityId: number;
  cityName: string;
  regionName: string;
  requestDate: Date;
  email: string;
  approved: boolean;
  comment: string;
};

export default UserRenewalTableData;
