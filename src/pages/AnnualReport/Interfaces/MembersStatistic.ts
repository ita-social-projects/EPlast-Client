export class MembersStatistic {
    id: number;
    numberOfPtashata: number;
    numberOfNovatstva: number;
    numberOfUnatstvaNoname: number;
    numberOfUnatstvaSupporters: number;
    numberOfUnatstvaMembers: number;
    numberOfUnatstvaProspectors: number;
    numberOfUnatstvaSkobVirlyts: number;
    numberOfSeniorPlastynSupporters: number;
    numberOfSeniorPlastynMembers: number;
    numberOfSeigneurSupporters: number;
    numberOfSeigneurMembers: number;
    annualReportId: number;

    constructor(obj: any) {
        this.id = 0;
        this.numberOfPtashata = obj.numberOfPtashata;
        this.numberOfNovatstva = obj.numberOfNovatstva;
        this.numberOfUnatstvaNoname = obj.numberOfUnatstvaNoname;
        this.numberOfUnatstvaSupporters = obj.numberOfUnatstvaSupporters;
        this.numberOfUnatstvaMembers = obj.numberOfUnatstvaMembers;
        this.numberOfUnatstvaProspectors = obj.numberOfUnatstvaProspectors;
        this.numberOfUnatstvaSkobVirlyts = obj.numberOfUnatstvaSkobVirlyts;
        this.numberOfSeniorPlastynSupporters = obj.numberOfSeniorPlastynSupporters;
        this.numberOfSeniorPlastynMembers = obj.numberOfSeniorPlastynMembers;
        this.numberOfSeigneurSupporters = obj.numberOfSeigneurSupporters;
        this.numberOfSeigneurMembers = obj.numberOfSeigneurMembers;
        this.annualReportId = 0;
    }
}