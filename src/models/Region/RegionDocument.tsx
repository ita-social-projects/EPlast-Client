export default class RegionDocument {
  id: number;
  blobName: string;
  fileName: string;
  submitDate?: string;
  regionId: number;

  constructor() {
    this.id = 0;
    this.blobName = "";
    this.fileName = "";
    this.submitDate = undefined;
    this.regionId = 0;
  }
}
