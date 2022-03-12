import IUserAnnualReportAccess from "../../../../../models/UserAccess/IUserAccess";
import ClubAnnualReport from "../../../Interfaces/ClubAnnualReport";

interface Props {
  record: ClubAnnualReport;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  userAnnualReportAccess: IUserAnnualReportAccess;
  onView: (id: number) => Promise<void>;
  onViewPDF: (id: number) => Promise<void>;
  onCancel: (id: number) => Promise<void>;
}

export default Props;
