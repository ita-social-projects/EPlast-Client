import Api from './api';

const checkCreated = async (cityId: number) => {
    return await Api.get(`AnnualReport/checkCreated/${cityId}`);
}

const getCityInfo = async (cityId: number) => {
    return await Api.get(`Cities/Profile/${cityId}`);
}

const getCityLegalStatuses = async () => {
    return await Api.get(`Cities/getLegalStatuses`);
}

const post = async (data: any) => {
    return await Api.post(`AnnualReport`, data);
}

export default { checkCreated, getCityInfo, getCityLegalStatuses, post };