import User from './User';
import PlannedEvents from './PlannedEvents';
import VisitedEvents from './VisitedEvents';
import CreatedEvents from './CreatedEvents';

export default class EventsUser {
    user: User;
    planedEvents: PlannedEvents[];
    visitedEvents: VisitedEvents[];
    createdEvents: CreatedEvents[];

    constructor() {
        this.user = new User();
        this.planedEvents = [new PlannedEvents()];
        this.visitedEvents = [new VisitedEvents()];
        this.createdEvents = [new CreatedEvents()];
    }
}