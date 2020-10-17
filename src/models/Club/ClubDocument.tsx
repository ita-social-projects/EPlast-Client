import ClubDocumentType from './ClubDocumentType';

export default class ClubDocument {
  id: number;
  ClubDocumentType: ClubDocumentType;
  blobName: string;
  fileName: string;
  submitDate?: string;
  ClubId: number;

  constructor() {
    this.id = 0;
    this.ClubDocumentType = new ClubDocumentType();
    this.blobName = "";
    this.fileName = "";
    this.submitDate = undefined;
    this.ClubId = 0;
  }
}