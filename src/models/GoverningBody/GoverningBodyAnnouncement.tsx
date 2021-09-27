export default class GoverningBodyAnnouncement {
    date: Date;
    id: number;
    text: string
    user: any;
    userId: string
  
    constructor() {
      this.date = new Date;
      this.id = 0;
      this.text = "";
      this.user = null;
      this.userId = "";
    }
  }