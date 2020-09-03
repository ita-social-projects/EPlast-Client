import AnnualReport from "../../../Interfaces/AnnualReport";

interface Props {
    record: AnnualReport;
    pageX: number;
    pageY: number;
    showDropdown: boolean;
    canManage: boolean;
    onView: (id: number) => Promise<void>;
    onCancel: (id: number) => Promise<void>;
}

export default Props;