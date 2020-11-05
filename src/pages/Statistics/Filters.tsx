import City from './Interfaces/City';
import Region from './Interfaces/Region';

const cityFilter = (city: City, searchedData: string) : boolean => {
    return city.name.toLowerCase().indexOf(searchedData.toLowerCase()) >= 0;
}

const regionFilter = (region: Region, searchedData: string) : boolean => {
    return region.regionName.toLowerCase().indexOf(searchedData.toLowerCase()) >= 0;
}

export default {cityFilter, regionFilter };