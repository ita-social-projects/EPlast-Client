export default class Course {
    id: number;
    name: string;
    link: string;
    isFinishedByUser :boolean;
  
    constructor() {
      this.id = 0;
      this.name = "";
      this.link = "";
      this.isFinishedByUser= false;
    }
  }