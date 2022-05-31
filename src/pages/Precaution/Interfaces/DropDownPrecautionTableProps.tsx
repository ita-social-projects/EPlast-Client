import Precaution from "./Precaution";
import UserPrecautionTableItem from "./UserPrecautionTableItem";

type DropDownProps = {
  recordId: number;
  userId: string;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  isRecordEditable: boolean;
  isRecordDeletable: boolean;
  onDelete: (id: number) => void;
  onEdit: (
    id: number,
    Precaution: Precaution,
    date: Date,
    endDate: Date,
    isActive: boolean,
    reason: string,
    status: string,
    reporter: string,
    number: number,
    user: any,
    userId: string
  ) => void;
};

export default DropDownProps;
