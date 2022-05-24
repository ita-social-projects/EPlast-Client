import api from "./api";
import UserPrecaution from "../pages/Precaution/Interfaces/UserPrecaution";
import Precaution from "../pages/Precaution/Interfaces/Precaution";
import PrecautionTableSettings from "../models/Precaution/PrecautionTableSettings";

const getUserPrecautionById = async (id: number) => {
  return await api.get(`Precaution/UserPrecaution/${id}`, id);
};
const getUserPrecautions = async () => {
  return (await api.get(`Precaution/UserPrecautions`)).data;
};

const getAllUsersPrecautions = async (
  NewTableSettings: PrecautionTableSettings
) => {
  return (
    await api
      .get(
        `Precaution/UsersPrecautionsForTable`,
        NewTableSettings,
        (params: any) => {
          return Object.entries(params)
            .map(([key, value]) => {
              if (Array.isArray(value) && value) {
                return value.map((it) => `${key}=${it}`).join("&");
              }
              return `${key}=${value}`;
            })
            .join("&");
        }
      )
      .catch((error) => {
        throw new Error(error);
      })
  ).data;
};

const getPrecautionById = async (id: number) => {
  return await api.get(`Precaution/${id}`, id);
};
const getPrecautions = async () => {
  return await api.get(`Precaution/Precautions`);
};
const getPrecautionOfGivenUser = async (id: string) => {
  return await api.get(`Precaution/User/Precautions/${id}`, id);
};
const deletePrecaution = async (id: number) => {
  return await api.remove(`Precaution/Delete/${id}`, id);
};
const deleteUserPrecaution = async (id: number) => {
  return await api.remove(`Precaution/UserPrecaution/Delete/${id}`, id);
};
const addUserPrecaution = async (data: UserPrecaution) => {
  return await api.post(
    `Precaution/UserPrecaution/Create/${data.userId}`,
    data
  );
};
const addPrecaution = async (data: Precaution) => {
  return await api.post(`Precaution/Create`, data);
};
const editUserPrecaution = async (data: UserPrecaution) => {
  return await api.put(`Precaution/UserPrecaution/Edit/${data.id}`, data);
};
const editPrecaution = async (data: Precaution) => {
  return await api.put(`Precaution/Edit/${data.id}`, data);
};
const checkNumberExisting = async (number: number) => {
  return await api.get(`Precaution/numberExist/${number}`, number);
};

const getUsersWithoutPrecautions = async () => {
  return (await api.get(`Precaution/usersWithoutPrecautions`)).data;
};
const checkUserPrecautionsType = async (userId: string, type: string) => {
  return await api.get(`Precaution/checkUserPrecautionsType/${userId}`, {
    userId,
    type,
  });
};
const getUserActivePrecautionEndDate = async (userId: string, type: string) => {
  return await api.get(`Precaution/getUserActivePrecautionEndDate/${userId}`, {
    userId,
    type,
  });
};

const getUsersForPrecaution = async () =>{
  return await api.get(`Precaution/getUsersForPrecaution`);
} 

export default {
  getUserActivePrecautionEndDate,
  checkUserPrecautionsType,
  getUserPrecautionById,
  getUserPrecautions,
  getAllUsersPrecautions,
  getPrecautionById,
  getPrecautions,
  getPrecautionOfGivenUser,
  getUsersForPrecaution,
  deletePrecaution,
  deleteUserPrecaution,
  addPrecaution,
  addUserPrecaution,
  editPrecaution,
  editUserPrecaution,
  checkNumberExisting,
  getUsersWithoutPrecautions,
};
