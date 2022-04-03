import Event from "./Event";
import Commandant from "./Commandant";
import Alternate from "./Alternate";
import Bunchuzhnyi from "./Bunchuzhnyi";
import Pysar from "./Pysar";

export default class EventEdit {
  event: Event;
  commandant: Commandant;
  alternate: Alternate;
  bunchuzhnyi: Bunchuzhnyi;
  pysar: Pysar;

  constructor() {
    this.event = new Event();
    this.commandant = new Commandant();
    this.alternate = new Alternate();
    this.bunchuzhnyi = new Bunchuzhnyi();
    this.pysar = new Pysar();
  }
}
