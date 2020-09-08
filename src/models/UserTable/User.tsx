import Gender from "./Gender";

export default class User {
    id: string;
    firstName: string;
    lastName: string;
    birthday?: Date;
    gender: Gender;

    constructor() {
        this.id = '';
        this.firstName = '';
        this.lastName = '';
        this.birthday = undefined;
        this.gender = new Gender();
    }
}