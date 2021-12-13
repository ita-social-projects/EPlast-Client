import IUserAnnualReportAccess from "../../../../../models/UserAccess/IUserAccess";
import ClubAnnualReport from "../../../Interfaces/ClubAnnualReport";

interface Props {
    record: ClubAnnualReport;
    pageX: number;
    pageY: number;
    userAnnualReportAccess: IUserAnnualReportAccess;
    showDropdown: boolean;
    onView: (id: number) => Promise<void>;
}

export default Props;
