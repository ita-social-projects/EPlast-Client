import api from "./api";
import UserDistinction from "../pages/Distinction/Interfaces/UserDistinction";
import Distinction from "../pages/Distinction/Interfaces/Distinction";
import DistinctionTableSettings from "../models/Distinction/DistinctionTableSettings";

const getUserDistinctionAccess = async (userId: string) => {
  return await api.get(`UserAccess/GetUserDistinctionAccess/${userId}`)
    .catch(error => {
      throw error;
    });
}

const getUserDistinctionById = async (id: number) => {
  return await api.get(`Distinction/UserDistinction/${id}`, id);
};
const getUserDistinctions = async () => {
  return (await api.get(`Distinction/UserDistinctions`)).data;
};

/*const getAllUsersDistinctions = async (searchedData: string, page: number, pageSize: number) => {
  return (await api.get('Distinction/UsersDistinctionsForTable',
    {
      searchedData: searchedData,
      page: page,
      pageSize: pageSize,
    })).data;
}*/
const getAllUsersDistinctions = async (NewTableSettings: DistinctionTableSettings) => {
  return (await api.get(`Distinction/UsersDistinctionsForTable`, NewTableSettings, (params:any)=> {
    return Object.entries(params).map(([key, value]) => {
      if (Array.isArray(value) && value){
          return value.map(it => `${key}=${it}`).join('&');
      }
      return `${key}=${value}`;
    }).join('&');
  })
  .catch((error) => {
    throw new Error(error);
  })).data;
}

const getDistinctionById = async (id: number) => {
  return await api.get(`Distinction/${id}`, id);
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
  return await api.put(`Distinction/Edit/${data.id}`, data);
};
const checkNumberExisting = async (number: number) => {
  return await api.get(`Distinction/numberExist/${number}`, number);
};

export default {
  getUserDistinctionById,
  getUserDistinctions,
  getAllUsersDistinctions,
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
  getUserDistinctionAccess,
};
