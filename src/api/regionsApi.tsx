import api from "./api";

export const GetAllRegions = async () => {
  return await api.get("Regions/Profiles").catch((error) => {
    throw new Error(error);
  });
};

 export const createRegion = async (data: any) => {
  const response = await api.post("Regions/AddRegion", data);
  return response;
};

export const getRegionById = async (regionId: number) => {
  const response = await api.get(`Regions/Profile/${regionId}` );
  return response;
};

export const getRegionLogo = async (logoName: string) => {
  return api.get("Regions/LogoBase64", { logoName }).catch((error) => {
    throw new Error(error);
  });
};

export const removeRegion = async (id: number) => {
  return api.remove(`Regions/RemoveRegion/${id}`, id).catch((error) => {
    throw new Error(error);
  });
};


export const addFollower = async (regionId: number, cityId:number) => {
  return api.post(`Regions/AddFollower/${regionId}/${cityId}`).catch((error) => {
    throw new Error(error);
  });
}



export const getRegionAdministration = async (regionId: number)=>{
   return api.get(`Regions/GetAdministration/${regionId}`).catch((error)=>{
    throw new Error(error);
  })
}


export default{
  getRegionAdministration,
  removeRegion,
  getRegionLogo,
  getRegionById,
  GetAllRegions,
  createRegion
}


