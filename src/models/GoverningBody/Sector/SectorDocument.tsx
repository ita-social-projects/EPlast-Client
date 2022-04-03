import SectorDocumentType from "./SectorDocumentType";

export default class SectorDocument {
  id: number;
  sectorDocumentType: SectorDocumentType;
  blobName: string;
  fileName: string;
  submitDate?: string;
  sectorId: number;

  constructor() {
    this.id = 0;
    this.sectorDocumentType = new SectorDocumentType();
    this.blobName = "";
    this.fileName = "";
    this.submitDate = undefined;
    this.sectorId = 0;
  }
}
