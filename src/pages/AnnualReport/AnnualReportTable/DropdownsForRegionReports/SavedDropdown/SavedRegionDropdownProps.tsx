import RegionAnnualReport from "../../../Interfaces/RegionAnnualReports";

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
    onView: (id: number, year: number) => Promise<void>;
}

export default Props;
