import api from "./api";



const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let { length } = bstr;
  const u8arr = new Uint8Array(length);

  while (length !== 0) {
    u8arr[length] = bstr.charCodeAt(length);
    length -= 1;
  }

  return new File([u8arr], filename, { type: mime });
};

export const GetAllRegions = async () => {
  return await api.get("Regions/Profiles").catch((error) => {
    throw new Error(error);
  });
};

export const EditRegion = async (regId:number, data:any) => {
  return await api.put(`Regions/EditRegion/${regId}`, data).catch((error) => {
    throw new Error(error);
  });
};


export const addDocument = async ( data: any) => {
  return api.post(`Regions/AddDocument`, data).catch((error) => {
    throw new Error(error);
  });
}


export const getRegionDocuments = async ( regionId: any) => {
  return api.get(`Regions/getDocs/${regionId}`).catch((error) => {
    throw new Error(error);
  });
}


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


export const removeAdmin = async (id: number) => {
  return api.remove(`Regions/RemoveAdministration/${id}`, id).catch((error) => {
    throw new Error(error);
  });
};


export const getFile = async (fileBlob: string, fileName: string) => {
  const response = await (await api.get(`Regions/FileBase64/${fileBlob}`, fileBlob)).data;
  const file = dataURLtoFile(response, fileBlob);
  const anchor = window.document.createElement('a');
  anchor.href = window.URL.createObjectURL(file);
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(anchor.href);
  return response;
}



export const addFollower = async (regionId: number, cityId:number) => {
  return api.post(`Regions/AddFollower/${regionId}/${cityId}`).catch((error) => {
    throw new Error(error);
  });
}

export const AddAdmin = async (data:any)=>{
  const response = api.post("Regions/AddAdministrator", data);
  return response;
}

export const getRegionAdministration = async (regionId: number)=>{
   return api.get(`Regions/GetAdministration/${regionId}`).catch((error)=>{
    throw new Error(error);
  })
}

export const getUsersAdministrations = async (userId:string)=>{
  return api.get(`Regions/GetUserAdministrations/${userId}`).catch((error)=>{
    throw new Error(error);
  })
}


export const getAdminTypes = async ()=>{
  return api.get(`Regions/GetAdminTypes`).catch((error)=>{
   throw new Error(error);
 })
}


export const removeDocument = async (documentId: number) => {
  return api.remove(`Regions/RemoveDocument/${documentId}`, documentId).catch((error) => {
    throw new Error(error);
  });
}



export default{
  removeDocument,
  getRegionDocuments,
  getUsersAdministrations,
  removeAdmin,
  AddAdmin,
  getAdminTypes,
  getRegionAdministration,
  EditRegion,
  removeRegion,
  getRegionLogo,
  getRegionById,
  GetAllRegions,
  createRegion
}


