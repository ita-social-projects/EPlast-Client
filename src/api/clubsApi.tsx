import axios from "axios";
import Api from "./api";
import BASE_URL from "../config";

const getById = async (id: number) => {
  const response = await Api.get("Club/"+ id);
  return response;
};

const getAll = async () => {
  const response = await Api.get("Club");
  return response;
};
const getAllMembers = async (id: number) => {
  const response = await Api.get("Club/" + id + "/members");
  return response;
};
const getAllFollowers = async (id: number) => {
  const response = await Api.get("Club/" + id + "/followers");
  return response;
};
const getAllAdmins = async (id: number) => {
  const response = await Api.get("Club/" + id + "/administration");
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

export default {
  getById,
  getAll,
  post,
  put,
  remove,
  getImage,
  getAllMembers,
  getAllFollowers,
  getAllAdmins,
};
