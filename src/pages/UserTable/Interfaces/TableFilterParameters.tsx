interface TableFilterParameters {
  Page: number;
  PageSize: number;
  Cities?: Array<number>;
  Regions?: Array<number>;
  Clubs?: Array<number>;
  Degrees?: Array<number>;
  Tab: string;
  SortKey: number;
  FilterRoles?: Array<string>;
  SearchData: string;
}

export default TableFilterParameters;
