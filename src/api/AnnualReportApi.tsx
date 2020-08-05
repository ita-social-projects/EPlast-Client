import Api from './api';
<<<<<<< HEAD

const checkCreated = async (cityId: number) => {
    return await Api.get(`AnnualReport/checkCreated/${cityId}`);
=======
import AnnualReport from '../pages/AnnualReport/Interfaces/AnnualReport';

const getCities = async () => {
    return await Api.get('Cities');
>>>>>>> origin
}

const getCityInfo = async (cityId: number) => {
    return await Api.get(`Cities/Profile/${cityId}`);
}

const getCityLegalStatuses = async () => {
<<<<<<< HEAD
    return await Api.get(`Cities/getLegalStatuses`);
}

const post = async (data: any) => {
    return await Api.post(`AnnualReport`, data);
}

export default { checkCreated, getCityInfo, getCityLegalStatuses, post };
=======
    return await Api.get('Cities/getLegalStatuses');
}

const getAnnualReportStatuses = async () => {
    return await Api.get('AnnualReport/getStatuses');
}

const checkCreated = async (cityId: number) => {
    return await Api.get(`AnnualReport/checkCreated/${cityId}`);
}

const getById = async (id: number) => {
    return await Api.get(`AnnualReport/${id}`);
}

const getAll = async () => {
    return await Api.get('AnnualReport');
}

const create = async (data: AnnualReport) => {
    return await Api.post('AnnualReport', data);
}

const edit = async (data: AnnualReport) => {
    return await Api.put('AnnualReport', data);
}

const confirm = async (id: number) => {
    return await Api.put(`AnnualReport/confirm/${id}`);
}

const cancel = async (id: number) => {
    return await Api.put(`AnnualReport/cancel/${id}`);
}

const remove = async (id: number) => {
    return await Api.remove(`AnnualReport/${id}`);
}

export default {
    getCities, getCityInfo, getCityLegalStatuses, getAnnualReportStatuses, checkCreated,
    getById, getAll, create, edit, confirm, cancel, remove
};
>>>>>>> origin
