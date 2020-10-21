import Api from './api';
import { AxiosError } from 'axios';
import MembersStatistic from '../pages/AnnualReport/Interfaces/MembersStatistic'
'../AnnualReport/Interfaces/';



const getStatisticsForCityForYear = async (cityId: number, year: number, indicators: Array<MembersStatistic> ) => {
    return await Api.get(`Statistics/city/${cityId}/${year}/${indicators}`)
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const getStatisticsForRegionForYear = async (regionId: number, year: number, indicators: Array<MembersStatistic> )  => {
    return await Api.get(`Statistics/region/${regionId}/${year}/${indicators}`)
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
} 

export {
    getStatisticsForCityForYear,
    getStatisticsForRegionForYear
};