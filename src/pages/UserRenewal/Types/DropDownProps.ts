type DropDownProps = {
  id: number;
  userId: string;
  cityId: number;
  isRecordActive: boolean;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  roles: string[];
  currentCity: number;
  onConfirm: () => void;
};

export default DropDownProps;
