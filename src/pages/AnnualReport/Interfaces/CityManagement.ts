import User from './User';

interface CityManagement {
    id: number;
    cityLegalStatusNew: number;
    cityLegalStatusOldId: number | null;
    userId: string | null;
    cityAdminNew: User | null;
    cityAdminOldId: number | null;
    annualReportId: number;
}

export default CityManagement;