import api from "./api";

export const getCityById = async (id: number) => {
  try {
    return await api.get(`Cities/Profile/${id}`, id);
  } catch (error) {
    throw new Error(error);
  }
};

export const getCitiesByPage = async (page: number, pageSize: number) => {
  try {
    return api.get(`Cities/Profiles/${page}`, { page, pageSize });
  } catch (error) {
    throw new Error(error);
  }
};

export const createCity = async (data: any) => {
  try {
    return api.post("Cities/CreateCity", data);
  } catch (error) {
    throw new Error(error);
  }
};

export const updateCity = async (id: number, data: any) => {
  try {
    return api.put(`Cities/EditCity/${id}`, data);
  } catch (error) {
    throw new Error(error);
  }
};

export const getLogo = async (logoName: string) => {
  try {
    return api.get("Cities/LogoBase64", { logoName });
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllAdmins = async (id: number) => {
  try {
    return api.get(`Cities/Admins/${id}`);
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllDocuments = async (id: number) => {
  try {
    return api.get(`Cities/Documents/${id}`);
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllMembers = async (id: number) => {
  try {
    return api.get(`Cities/Members/${id}`);
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllFollowers = async (id: number) => {
  try {
    return api.get(`Cities/Followers/${id}`);
  } catch (error) {
    throw new Error(error);
  }
};

export const toggleMemberStatus = async (id: number) => {
  try {
    return api.put(`Cities/ChangeApproveStatus/${id}`, id);
  } catch (error) {
    throw new Error(error);
  }
}

export const addFollower = async (cityId: number) => {
  try {
    return api.post(`Cities/AddFollower/${cityId}`, cityId);
  } catch (error) {
    throw new Error(error);
  }
}

export const removeFollower = async (followerId: number) => {
  try {
    return api.remove(`Cities/RemoveFollower/${followerId}`, followerId);
  } catch (error) {
    throw new Error(error);
  }
}
