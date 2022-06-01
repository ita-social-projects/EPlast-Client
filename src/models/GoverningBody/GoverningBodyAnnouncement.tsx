export default class GoverningBodyAnnouncement {
  date: Date;
  id: number;
  governingBodyId?: number;
  sectorId?: number;
  text: string;
  title: string;
  user: any;
  userId: string;
  imagesPresent: boolean;
  isPined: boolean;

  constructor() {
    this.date = new Date();
    this.id = 0;
    this.text = "";
    this.title = "";
    this.user = null;
    this.userId = "";
    this.imagesPresent = false;
    this.isPined = false;
  }
}
