import User from './User';
import CreatedEvents from './CreatedEvents';

export default class EventsUser {
    user: User;
    createdEvents: CreatedEvents[];

    constructor() {
        this.user = new User();
        this.createdEvents = [new CreatedEvents()];
    }
}