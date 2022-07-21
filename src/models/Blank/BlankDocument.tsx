export default class BlankDocument {
  id: number;
  blobName: string;
  fileName: string;
  userId: string;
  courseId: number | undefined;

  constructor() {
    this.id = 0;
    this.blobName = "";
    this.fileName = "";
    this.userId = "";
    this.courseId = 0;
    
  }
}
