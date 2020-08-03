import AnnualReport from "../../../Interfaces/AnnualReport";

interface Props {
    record: AnnualReport;
    pageX: number;
    pageY: number;
    showDropdown: boolean;
    onView: (id: number) => Promise<void>;
    onEdit: (id: number) => void;
    onConfirm: (id: number) => Promise<void>;
    onRemove: (id: number) => Promise<void>;
}

export default Props;