import ClubAnnualReport from "../../../Interfaces/ClubAnnualReport";

interface Props {
    record: ClubAnnualReport;
    pageX: number;
    pageY: number;
    showDropdown: boolean;
    canManage: boolean;
    onView: (id: number) => Promise<void>;
    onEdit: (id: number) => void;
    onConfirm: (id: number) => Promise<void>;
    onRemove: (id: number) => Promise<void>;
}

export default Props;