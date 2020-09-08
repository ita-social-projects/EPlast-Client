import axios from "axios";
import Api from "./api";
import BASE_URL from "../config";

const getById = async (id: number) => {
  const response = await Api.get(`Club/${id}`, {id});
  return response;
};

const getAll = async () => {
  const response = await Api.get("Club");
  return response;
};

const getClubsByPage = async (pageNumber: number, pageSize: number) => {
  const response = await Api.get(`Club/page/${pageNumber}`, {pageNumber, pageSize});
  return response;
}

const getClubsCount = async () => {
  const response = await Api.get("Club/count");
  return response;
}

const getAllMembers = async (clubId: number) => {
  const response = await Api.get(`Club/${clubId}/members`, {clubId});
  return response;
};
const getAllFollowers = async (clubId: number) => {
  const response = await Api.get(`Club/${clubId}/followers`, {clubId});
  return response;
};
const getAllAdmins = async (clubId: number) => {
  const response = await Api.get(`Club/${clubId}/administration`, {clubId});
  return response;
};
const post = async (url: string, data: any) => {
  const response = await Api.post(url, data);
  return response;
};

const put = async (data: any) => {
  const response = await Api.put("Club", data);
  return response;
};

const remove = async (id: number) => {
  const response = await Api.put("Club", id);
  return response;
};

const getImage = async (imageName: string | undefined) => {
  const response = await axios.get(
    `${`${BASE_URL}Club/getImage`}/${imageName}`
  );
  return response;
};

const addFollower = async (clubId: number, userId: string) => {
  const response = await Api.post(`Club/${clubId}/add-follower/${userId}`, {clubId, userId});
  return response;
}

const toggleMemberStatus = async (clubId: number, memberId: number) => {
  const response = await Api.put(`Club/${clubId}/member/${memberId}/change-status`, {clubId, memberId});
  return response;
}

const removeMember = async (memberId: number) => {
  const response = await Api.remove(`Club/remove-member/${memberId}`, {memberId});
  return response;
}

const removeAdministrator = async (adminId: number) => {
  const response = await Api.remove(`Club/administration/${adminId}`, {adminId});
  return response;
}

const addAdministrator = async (clubId: number, data: any) => {
  const response = await Api.post(`Club/${clubId}/add-administration`, {clubId, data});
  return response;
}

const setAdministratorEndDate = async (adminId: number, endDate: string | undefined) => {
  const response = await Api.put(`Club/administration/${adminId}/change-end-date`, {adminId, endDate});
  return response;
}

export default {
  getById,
  getAll,
  getClubsByPage,
  getClubsCount,
  post,
  put,
  remove,
  getImage,
  getAllMembers,
  getAllFollowers,
  getAllAdmins,
  addFollower,
  toggleMemberStatus,
  removeMember,
  removeAdministrator,
  addAdministrator,
  setAdministratorEndDate,
};
