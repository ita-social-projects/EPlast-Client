interface TableFilterParameters {
    Page: number;
    PageSize: number;
    Cities?: Array<string>;
    Regions?: Array<string>;
    Clubs?: Array<string>;
    Degrees?: Array<string>;
    Tab: string;
}

export default TableFilterParameters;
