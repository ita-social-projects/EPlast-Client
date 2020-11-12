import RegionAnnualReport from "../../../Interfaces/RegionAnnualReports";

interface Props {
    regionRecord: RegionAnnualReport;
    pageX: number;
    pageY: number;
    canManage: boolean;
    showDropdown: boolean;
    onView: (id: number, year: number) => Promise<void>;
}

export default Props;