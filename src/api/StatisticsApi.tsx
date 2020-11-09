import Api from './api';
import { AxiosError } from 'axios';
import StatisticsItemIndicator from '../pages/Statistics/Interfaces/StatisticsItemIndicator';
import StatisticsParameters from '../pages/Statistics/Interfaces/StatisticsParameters';

const getStatisticsForCitiesForYears = async (data: StatisticsParameters) => {
    /* overriding axios serialization method due to issue with it returning url string with [] brackets.
    For example: CitiesId[]=10&CitiesId[]=9 */
    debugger;
    return await Api.get(`Statistics/cities`, data, (params: any) => {
        return Object.entries(params).map(([key, value]) => {
            if (Array.isArray(value)) return value.map(it => `${key}=${it}`).join('&');
            return `${key}=${value}`;
        }).join('&');
    })
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const getStatisticsForRegionsForYears = async (regionsId: Array<number>, years: Array<number>, indicators: Array<StatisticsItemIndicator>) => {
    return await Api.get(`Statistics/regions`)
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const getAllCitiesStatistics = async () => {
    return await Api.get(`Statistics/cities/allstatistics`)
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const getIndicators = async () => {
    return await Api.get(`Statistics/getIndicators`)
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

export default {
    getStatisticsForCitiesForYears,
    getStatisticsForRegionsForYears,
    getAllCitiesStatistics,
    getIndicators
};