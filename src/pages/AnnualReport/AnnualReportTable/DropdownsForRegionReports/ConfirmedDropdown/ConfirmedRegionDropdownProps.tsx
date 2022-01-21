import IUserAnnualReportAccess from "../../../../../models/UserAccess/IUserAccess";

interface Props {
    regionRecord: {
        count: number;
        date: Date;
        id: number;
        regionName: string;
        status: number;
        total: number;
    };
    pageX: number;
    pageY: number;
    showDropdown: boolean;
    userAnnualReportAccess: IUserAnnualReportAccess;
    onView: (id: number, year: number) => Promise<void>;
    onCancel: (id: number) => Promise<void>;
}

export default Props;
