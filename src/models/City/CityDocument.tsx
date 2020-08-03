import CityDocumentType from './CityDocumentType';

export default class CityDocument {
    id: number;
    cityDocumentType: CityDocumentType;

    constructor () {
        this.id = 0;
        this.cityDocumentType = new CityDocumentType();
    }
  }