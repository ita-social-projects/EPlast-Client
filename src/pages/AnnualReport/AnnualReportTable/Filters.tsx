import User from '../Interfaces/User';
import City from '../Interfaces/City';
import Region from '../Interfaces/Region';
import moment from 'moment';

const idFilter = (id: number, searchedData: string) : boolean => {
    return id.toString().toLowerCase().indexOf(searchedData.toLowerCase()) >= 0;
}

const userFilter = (user: User, searchedData: string) : boolean => {
    let userName = String.prototype.concat(user.firstName, ' ', user.lastName);
    return userName.toLowerCase().indexOf(searchedData.toLowerCase()) >= 0;
}

const cityFilter = (city: City, searchedData: string) : boolean => {
    return city.name.toLowerCase().indexOf(searchedData.toLowerCase()) >= 0;
}

const regionFilter = (region: Region, searchedData: string) : boolean => {
    return region.regionName.toLowerCase().indexOf(searchedData.toLowerCase()) >= 0;
}

const dateFilter = (date: Date, searchedData: string) : boolean => {
    return moment(date.toLocaleString()).format('DD-MM-YYYY').toLowerCase()
        .indexOf(searchedData.toLowerCase()) >= 0;
}

const statusFilter = (status: number, statusNames: string[], searchedData: string) : boolean => {
    return statusNames[status].toLowerCase().indexOf(searchedData.toLowerCase()) >= 0;
}

export default { idFilter, userFilter, cityFilter, regionFilter, dateFilter, statusFilter };