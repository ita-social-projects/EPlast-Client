import TermsOfUse from "../models/TermsOfUse/TermsOfUseModel";
import api from "./api";

const getTerms = async () =>{
    return (await api.get(`Terms/Data`)).data;
};

const getUsersId = async () =>{
    return (await api.get(`Terms/UsersId`)).data;
};

const putTermById = async (data:TermsOfUse)=>{
    return await api.put(`Terms/Data/${data.termsId}`, data).catch((error) => {
        throw new Error(error)});
};

export default {
    getTerms,
    getUsersId,
    putTermById
};