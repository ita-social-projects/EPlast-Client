import Precaution from "./Precaution"

type DropDownProps = {
    record: number;
    userId: string;
    isRecordActive: boolean;
    pageX: number;
    pageY: number;
    showDropdown: boolean;
    canEditActive: boolean,
    canEditInactive: boolean,
    canDeleteActive: boolean,
    canDeleteInactive: boolean,
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
  }
  
export default DropDownProps