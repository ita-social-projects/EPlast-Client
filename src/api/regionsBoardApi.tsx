import api from "./api";

export const getUserAccess = async (userId: string) => {
  return await api
    .get(`RegionsBoard/GetUserAccesses/${userId}`, userId)
    .catch((error) => {
      throw error;
    });
};

export const getDocs = async (regionId: number) => {
  return await api
    .get("RegionsBoard/getDocs/" + regionId, regionId)
    .catch((error) => {
      throw error;
    });
};

export const getUsersForGoverningBodyAdminForm = async () => {
  return await api
    .get(`GoverningBodies/getUsersForGoverningBodyAdminForm`)
    .catch((error) => {
      throw new Error(error);
    });
};
