import api from "./api";

export const GetAllRegions = async () => {
  return await api.get("Regions/Profiles").catch((error) => {
    throw new Error(error);
  });
};