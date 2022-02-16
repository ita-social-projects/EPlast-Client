import axios from "axios";
import Api from "./api";
import BASE_URL from "../config";
import TableFilterParameters from "../pages/UserTable/Interfaces/TableFilterParameters";

export const getUsersForTable = async () => {
  return await Api.get(`Admin/usersTable`);
};

export const getShortUserInfo = async (search: string) => {
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

export const getUsersByAllRoles = async (roles: string[][], include:boolean) => {
  const response = await Api.get(`Admin/GetUsersByAllRoles/${roles.map(x => x.join(',')).join('|')}/${include}`);

  return response;
};

export const getUsersByAnyRole = async (roles: string[][], include:boolean) => {
  const response = await Api.get(`Admin/GetUsersByAnyRole/${roles.map(x => x.join(',')).join('|')}/${include}`);

  return response;
};

export const getUsersByExactRoles = async (roles: string[][], include:boolean) => {
  const response = await Api.get(`Admin/GetUsersByExactRoles/${roles.map(x => x.join(',')).join('|')}/${include}`);
  
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

const isCityMember = async (userId: string) => {
  const response = await Api.get(`Admin/IsCityMember/${userId}`);
  return response.data;
};
export default {
  getUsersByAnyRole,
  getUsersByAllRoles,
  getUsersByExactRoles,
  getCityRegionAdmins,
  getUsersForTable,
  getShortUserInfo,
  deleteUser,
  getRolesForEdit,
  putEditedRoles,
  putExpiredRole,
  putCurrentRole,
  isCityMember,
};
