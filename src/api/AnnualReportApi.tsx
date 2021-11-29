import Api from './api';
import AnnualReport from '../pages/AnnualReport/Interfaces/AnnualReport';
import { AxiosError } from 'axios';
import api from './api';

const getCitiesOptions = async () => {
    return await Api.get('Cities/CitiesOptions')
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const getCities = async () => {
    return await Api.get('Cities/Cities')
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const getCityMembers = async (cityId: number) => {
    return await Api.get(`AnnualReport/Members/${cityId}`)
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const getCityInfo = async (cityId: number) => {
    return await Api.get(`Cities/Profile/${cityId}`)
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const getCityLegalStatuses = async () => {
    return await Api.get('Cities/getLegalStatuses')
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const getAnnualReportStatuses = async () => {
    return await Api.get('AnnualReport/getStatuses')
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const checkCreated = async (cityId: number) => {
    return await Api.get(`AnnualReport/checkCreated/${cityId}`)
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const getById = async (id: number) => {
    return await Api.get(`AnnualReport/${id}`)
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const getPdf = async (id: number) => {
    const data = await (await Api.get(`AnnualReport/createPdf/${id}`)).data;
    const binaryString = window.atob(data);
    console.log(binaryString);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i += 1) {
        const ascii = binaryString.charCodeAt(i);
        if (71 <= i && i <= 83) {
            console.log(i, binaryString[i], ascii);
        }
        bytes[i] = ascii;
    };
    const blob = new Blob([bytes], { type: "application/pdf" });
    console.log(binaryString)
    const link = window.URL.createObjectURL(blob);
    return link;
};

const getAnnualReportEditFormById = async (id: number) => {
    return await Api.get(`AnnualReport/EditCityAnnualReportForm/${id}`).then((response) => {
        return response
    })
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const getAll = async (searchedData: string, page: number, pageSize: number, sortKey: number, authReport: boolean) => {
    return await Api.get('AnnualReport/Cities',
        {
            searchedData: searchedData,
            page: page,
            pageSize: pageSize,
            sortKey: sortKey,
            auth: authReport
        })
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const create = async (data: AnnualReport) => {
    return await Api.post('AnnualReport', data)
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const edit = async (data: AnnualReport) => {
    return await Api.put('AnnualReport', data)
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const confirm = async (id: number) => {
    return await Api.put(`AnnualReport/confirm/${id}`)
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const cancel = async (id: number) => {
    return await Api.put(`AnnualReport/cancel/${id}`)
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const remove = async (id: number) => {
    return await Api.remove(`AnnualReport/${id}`)
        .catch((error: AxiosError) => {
            throw new Error(error.response?.data.message);
        });
}

const getUserAnnualReportAccess = async (userId: string) => {
    return await api.get(`UserAccess/GetUserAnnualReportAccess/${userId}`)
        .catch(error => {
            throw error;
        });
}

export default {
    getCitiesOptions, getCities, getCityInfo, getCityLegalStatuses, getAnnualReportStatuses, checkCreated,
    getById, getPdf, getAll, create, edit, confirm, cancel, remove, getAnnualReportEditFormById, getCityMembers, getUserAnnualReportAccess
};