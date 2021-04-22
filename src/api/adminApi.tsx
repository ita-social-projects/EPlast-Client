import axios from "axios";
import Api from "./api";
import BASE_URL from "../config";
import TableFilterParameters from "../pages/UserTable/Interfaces/TableFilterParameters";

const getUsersForTable = async () => {
  const response = await Api.get(`Admin/usersTable`);

  return response;
};

const getShortUserInfo = async (search: string) => {
    const response = await Api.get(`Admin/ShortUsersInfo/${search}`);
    return response;
  };

export const getUsersForTableByPage = async (data: TableFilterParameters) => {
  return await Api
    .get(`Admin/Profiles`, data, (params:any)=> {
      return Object.entries(params).map(([key, value]) => {
      if (Array.isArray(value)) return value.map(it => `${key}=${it}`).join('&');
        return `${key}=${value}`;
    }).join('&');
})
    .catch((error) => {
      throw new Error(error);
    });
};


const getCityRegionAdmins = async (userId: string) => {
  const response = await Api.get(`Admin/CityRegionAdmins/${userId}`);
  return response;
};

const deleteUser = async (userId: string) => {
  const response = await Api.remove(`Admin/deleteUser/${userId}`);

  return response;
};

const getRolesForEdit = async (userId: string) => {
  const response = await Api.get(`Admin/editRole/${userId}`);

  return response;
};

const putEditedRoles = async (userId: string, userRoles: any) => {
  const response = await Api.put(`Admin/editedRole/${userId}`, userRoles);

  return response;
};

const putExpiredRole = async (userId: string) => {
  const response = await Api.put(`Admin/changeRole/${userId}`);

  return response;
};

const putCurrentRole = async (userId: string, role: string) => {
  const response = await Api.put(`Admin/changeRole/${userId}/${role}`);

  return response;
};

export default {
  getCityRegionAdmins,
  getUsersForTable,
  getShortUserInfo,
  deleteUser,
  getRolesForEdit,
  putEditedRoles,
  putExpiredRole,
  putCurrentRole,
};
