import api from "./api";
import UserDistinction from "../pages/Distinction/Interfaces/UserDistinction";
import Distinction from "../pages/Distinction/Interfaces/Distinction";

const getUserDistinctionById = async (id: number) => {
  return await api.get(`Distinction/UserDistinction/${id}`, id);
};
const getUserDistinctions = async () => {
  return (await api.get(`Distinction/UserDistinctions`)).data;
};
const getDistinctionById = async (id: number) => {
  return await api.get(`${id}`, id);
};
const getDistinctions = async () => {
  return await api.get(`Distinction/Distinctions`);
};
const getDistinctionOfGivenUser = async (id: string) => {
  return await api.get(`Distinction/User/Distinctions/${id}`, id);
};
const deleteDistinction = async (id: number) => {
  return await api.remove(`Distinction/Delete/${id}`, id);
};
const deleteUserDistinction = async (id: number) => {
  return await api.remove(`Distinction/UserDistinction/Delete/${id}`, id);
};
const addUserDistinction = async (data: UserDistinction) => {
  return await api.post(
    `Distinction/UserDistinction/Create/${data.userId}`,
    data
  );
};
const addDistinction = async (data: Distinction) => {
  return await api.post(`Distinction/Create`, data);
};
const editUserDistinction = async (data: UserDistinction) => {
  return await api.put(`Distinction/UserDistinction/Edit/${data.id}`, data);
};
const editDistinction = async (data: Distinction) => {
  return await api.put(`Distinction/Edit/${data.id}`, data.id);
};
const checkNumberExisting = async (number: number) => {
  return await api.get(`Distinction/numberExist/${number}`, number);
};

export default {
  getUserDistinctionById,
  getUserDistinctions,
  getDistinctionById,
  getDistinctions,
  getDistinctionOfGivenUser,
  deleteDistinction,
  deleteUserDistinction,
  addDistinction,
  addUserDistinction,
  editDistinction,
  editUserDistinction,
  checkNumberExisting,
};
