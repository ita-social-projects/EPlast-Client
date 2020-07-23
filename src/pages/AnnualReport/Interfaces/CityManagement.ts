import { User } from './User';

export class CityManagement {
    id: number;
    cityLegalStatusNew: number;
    cityLegalStatusOldId: number | null;
    userId: string;
    cityAdminNew: User | null;
    cityAdminOldId: number | null;
    annualReportId: number;

    constructor(obj: any) {
        this.id = 0;
        this.cityLegalStatusNew = obj.cityLegalStatusNew;
        this.cityLegalStatusOldId = null;
        this.userId = obj.userId;
        this.cityAdminNew = null;
        this.cityAdminOldId = null;
        this.annualReportId = 0;
    }
}