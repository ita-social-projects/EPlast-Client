import Precaution from "./Precaution";
import PrecautionUser from "./PrecautionUser";
import UserPrecautionStatus from "./UserPrecautionStatus";
import UserPrecautionTableItem from "./UserPrecautionTableItem";

type DropDownProps = {
  recordId: number;
  userId: string;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  userAccess: { [key: string]: boolean };
  isActive: boolean;
  onDelete: (id: number) => void;
  onEdit: (
    id: number,
    Precaution: Precaution,
    date: Date,
    endDate: Date,
    isActive: boolean,
    reason: string,
    status: UserPrecautionStatus,
    reporter: string,
    number: number,
    userId: PrecautionUser,
    user: any
  ) => void;
};

export default DropDownProps;
