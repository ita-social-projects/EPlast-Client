import Api from "./api";
import { AxiosError } from "axios";
import CitiesStatisticsParameters from "../pages/Statistics/Interfaces/CitiesStatisticsParameters";
import RegionsStatisticsParameters from "../pages/Statistics/Interfaces/RegionsStatisticsParameters";

const getCitiesStatistics = async (data: CitiesStatisticsParameters) => {
    /* overriding axios serialization method due to issue with it returning url string with [] brackets.
    For example: CitiesId[]=10&CitiesId[]=9 */
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

const getRegionsStatistics = async (data: RegionsStatisticsParameters) => {
    /* overriding axios serialization method due to issue with it returning url string with [] brackets.
    For example: CitiesId[]=10&CitiesId[]=9 */
    return await Api.get(`Statistics/regions`, data, (params: any) => {
        return Object.entries(params).map(([key, value]) => {
            if (Array.isArray(value)) return value.map(it => `${key}=${it}`).join('&');
            return `${key}=${value}`;
        }).join('&');
    })
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

export default {
    getCitiesStatistics,
    getRegionsStatistics
}