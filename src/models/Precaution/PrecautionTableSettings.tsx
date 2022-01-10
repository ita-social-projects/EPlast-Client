export default class PrecautionTableSettings {
    sortByOrder?: Array<string>;
    statusSorter?: Array<string>;
    precautionNameSorter?: Array<string>;
    dateSorter?: Array<string>;
    searchedData: string;
    page: number;
    pageSize: number;

  constructor() {
    this.sortByOrder = [];
    this.statusSorter = [];
    this.precautionNameSorter = [];
    this.dateSorter = [];
    this.searchedData = "";
    this.page = 0;
    this.pageSize = 0;
  }
}