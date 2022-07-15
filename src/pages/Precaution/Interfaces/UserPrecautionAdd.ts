import UserPrecautionStatus from "./UserPrecautionStatus";

type UserPrecautionAdd = {
    precautionId: number;
    reporter: string;
    reason: string;
    status: UserPrecautionStatus;
    number: number;
    date: Date;
    userId: string;
};

export default UserPrecautionAdd;
