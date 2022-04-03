export default class PrecautionTableSettings {
  sortByOrder?: Array<string>;
  statusFilter?: Array<string>;
  precautionNameFilter?: Array<string>;
  dateFilter?: Array<string>;
  searchedData: string;
  page: number;
  pageSize: number;

  constructor() {
    this.sortByOrder = [];
    this.statusFilter = [];
    this.precautionNameFilter = [];
    this.dateFilter = [];
    this.searchedData = "";
    this.page = 0;
    this.pageSize = 0;
  }
}
