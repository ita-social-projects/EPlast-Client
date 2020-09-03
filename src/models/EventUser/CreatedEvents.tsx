export default class CreatedEvents {
    id: number;
    eventName: string;
    eventDateStart?: Date;
    eventDateEnd?: Date;
    eventStatusID: number;
    eventTypeID: number;

    constructor() {
        this.id = 0;
        this.eventName = '';
        this.eventDateStart = undefined;
        this.eventDateEnd = undefined;
        this.eventStatusID = 0;
        this.eventTypeID = 0;
    }
}