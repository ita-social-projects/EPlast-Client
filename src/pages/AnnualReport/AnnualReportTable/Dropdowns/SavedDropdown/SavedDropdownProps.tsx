import IUserAnnualReportAccess from "../../../../../models/UserAccess/IUserAccess";
import AnnualReport from "../../../Interfaces/AnnualReport";

interface Props {
  record: AnnualReport;
  pageX: number;
  pageY: number;
  userAnnualReportAccess: IUserAnnualReportAccess;
  showDropdown: boolean;
  onView: (id: number) => Promise<void>;
  onViewPDF: (id: number) => Promise<void>;
}

export default Props;
