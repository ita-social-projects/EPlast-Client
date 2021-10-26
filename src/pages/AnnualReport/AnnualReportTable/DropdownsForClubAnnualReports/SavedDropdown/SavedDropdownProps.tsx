import ClubAnnualReport from "../../../Interfaces/ClubAnnualReport";

interface Props {
    record: ClubAnnualReport;
    pageX: number;
    pageY: number;
    showDropdown: boolean;
    onView: (id: number) => Promise<void>;
}

export default Props;
