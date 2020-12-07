import axios from "axios";
import Api from "./api";
import BASE_URL from "../config";

const getUsersForTable = async () => {
  const response = await Api.get(`Admin/usersTable`);

  return response;
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
  deleteUser,
  getRolesForEdit,
  putEditedRoles,
  putExpiredRole,
  putCurrentRole,
};
