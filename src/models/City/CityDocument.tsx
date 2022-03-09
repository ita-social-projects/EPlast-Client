import CityDocumentType from "./CityDocumentType";

export default class CityDocument {
  id: number;
  cityDocumentType: CityDocumentType;
  blobName: string;
  fileName: string;
  submitDate?: string;
  cityId: number;

  constructor() {
    this.id = 0;
    this.cityDocumentType = new CityDocumentType();
    this.blobName = "";
    this.fileName = "";
    this.submitDate = undefined;
    this.cityId = 0;
  }
}
