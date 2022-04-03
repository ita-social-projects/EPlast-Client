import ClubDocumentType from "./ClubDocumentType";

export default class ClubDocument {
  id: number;
  clubDocumentType: ClubDocumentType;
  blobName: string;
  fileName: string;
  submitDate?: string;
  ClubId: number;

  constructor() {
    this.id = 0;
    this.clubDocumentType = new ClubDocumentType();
    this.blobName = "";
    this.fileName = "";
    this.submitDate = undefined;
    this.ClubId = 0;
  }
}
