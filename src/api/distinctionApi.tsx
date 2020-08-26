import api from "./api";
import UserDistinction from "../pages/Distinction/Interfaces/UserDistinction";
import Distinction from "../pages/Distinction/Interfaces/Distinction";

const getUserDistinctionById = async (id:number) => {
    return await api.get(`UserDistinction/${id}`,id)
};
const getUserDistinctions = async () => {
    return await api.get(`UserDistinctions`)
};
const getDistinctionById = async (id:number) => {
    return await api.get(`${id}`,id)
};
const getDistinctions = async () => {
    return await api.get(`Distinctions`)
};
const getDistinctionOfGivenUser = async (id:string) => {
    return await api.get(`User/Distinctions/${id}`,id)
};
const deleteDistinction = async (id:number) => {
    return await api.remove(`Distinction/Delete/${id}`, id)
};
const deleteUserDistinction = async (id:number) => {
    return await api.remove(`UserDistinction/Delete/${id}`,id)
};
const addUserDistinction = async (data: UserDistinction) => {
    return await api.post(`UserDistinction/Create/${data.userId}`, data.userId)
};
const addDistinction = async (data: Distinction) => {
    return await api.post(`Create`, data)
};
const editUserDistinction = async (data: UserDistinction) => {
    return await api.put(`UserDistinction/Edit/${data.distinctionId}`, data.distinctionId)
};
const editDistinction = async (data: Distinction) => {
    return await api.put(`Edit/${data.id}`, data.id)
};

export default { getUserDistinctionById, getUserDistinctions,
getDistinctionById, getDistinctions, getDistinctionOfGivenUser,
deleteDistinction, deleteUserDistinction,
addDistinction, addUserDistinction,
editDistinction, editUserDistinction };


