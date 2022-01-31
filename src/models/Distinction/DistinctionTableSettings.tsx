export default class DistinctionTableSettings {
    sortByOrder?: Array<string>;
    searchedData: string;
    page: number;
    pageSize: number;

  constructor() {
    this.sortByOrder = [];
    this.searchedData = "";
    this.page = 0;
    this.pageSize = 0;
  }
}