import GoverningBodyDocumentType from "./GoverningBodyDocumentType";

export default class GoverningBodyDocument {
  id: number;
  governingBodyDocumentType: GoverningBodyDocumentType;
  blobName: string;
  fileName: string;
  submitDate?: string;
  governingBodyId: number;

  constructor() {
    this.id = 0;
    this.governingBodyDocumentType = new GoverningBodyDocumentType();
    this.blobName = "";
    this.fileName = "";
    this.submitDate = undefined;
    this.governingBodyId = 0;
  }
}
