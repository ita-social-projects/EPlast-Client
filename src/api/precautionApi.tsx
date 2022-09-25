import PrecautionTableSettings from "../models/Precaution/PrecautionTableSettings";
import Precaution from "../pages/Precaution/Interfaces/Precaution";
import UserPrecautionAdd from "../pages/Precaution/Interfaces/UserPrecautionAdd";
import UserPrecautionEdit from "../pages/Precaution/Interfaces/UserPrecautionEdit";
import api from "./api";

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
const getUserAccess = async (id: string) => {
  return await api.get(`UserAccess/GetUserPrecautionsAccess/${id}`, id);
};
const deletePrecaution = async (id: number) => {
  return await api.remove(`Precaution/Delete/${id}`, id);
};
const deleteUserPrecaution = async (id: number) => {
  return await api.remove(`Precaution/UserPrecaution/Delete/${id}`, id);
};
const addUserPrecaution = async (data: UserPrecautionAdd) => {
  return await api.post(`Precaution/UserPrecaution/Create`, data);
};
const addPrecaution = async (data: Precaution) => {
  return await api.post(`Precaution/Create`, data);
};
const editUserPrecaution = async (data: UserPrecautionEdit) => {
  return await api.put(`Precaution/UserPrecaution/Edit`, data);
};
const editPrecaution = async (data: Precaution) => {
  return await api.put(`Precaution/Edit/${data.id}`, data);
};
const checkNumberExisting = async (number: number) => {
  return await api.get(`Precaution/numberExist/${number}`, number);
};

const getUsersWithoutPrecautions = async () => {
  return await api.get(`Precaution/usersWithoutPrecautions`);
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

const getUsersForPrecaution = async () => {
  return await api.get(`Precaution/getUsersForPrecaution`);
};

export default {
  getUserActivePrecautionEndDate,
  checkUserPrecautionsType,
  getUserPrecautionById,
  getUserPrecautions,
  getAllUsersPrecautions,
  getPrecautionById,
  getPrecautions,
  getPrecautionOfGivenUser,
  getUserAccess,
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
