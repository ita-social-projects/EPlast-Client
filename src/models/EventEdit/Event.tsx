export default class Event {
    description: string;
    eventCategoryID: number;
    eventDateStart?: Date;
    eventDateEnd?: Date;
    eventName: string;
    eventStatusID: number;
    eventTypeID: number;
    eventlocation: string;
    forWhom: string;
    formOfHolding: string;
    id: number;
    numberOfPartisipants: number;
    questions: string;

    constructor() {
        this.description = '';
        this.eventCategoryID = 0;
        this.eventDateStart = undefined;
        this.eventDateEnd = undefined;
        this.eventName = '';
        this.eventStatusID = 0;
        this.eventTypeID = 0;
        this.eventlocation = '';
        this.forWhom = '';
        this.formOfHolding = '';
        this.id = 0;
        this.numberOfPartisipants = 0;
        this.questions = '';
    }
}