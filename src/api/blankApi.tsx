import api from "./api";

export const addDocument = async (userId: number, data: any) => {
    return api.post(`Blanks/AddDocument/${userId}`, data).catch((error) => {
      throw new Error(error);
    });
  }
  export const addAchievementDocuments = async(userId:number,data:any)=>{
    return api.post(`Blanks/AddAchievementDocumet/${userId}`,data).catch((error)=>{
      throw new Error(error);
    });
  }

export const getDocumentByUserId = async (userId:string) => {
    return api.get(`Blanks/GetDocumentByUserId/${userId}`);
  }

  export const getAllAchievementDocumentsByUserId = async(userId:string)=>{
    return api.get(`Blanks/GetAchievementDocumentsByUserId/${userId}`);
  }

  export const removeDocument = async (documentId: number) => {
    return api.remove(`Blanks/RemoveBiographyDocument/${documentId}`, documentId).catch((error) => {
      throw new Error(error);
    });
  }
  export const removeAchievementDocument = async (documentId: number) => {
    return api.remove(`Blanks/RemoveAchievementDocument/${documentId}`, documentId).catch((error) => {
      throw new Error(error);
    });
  }

  export const getFile = async (fileBlob: string, fileName: string) => {
    const response = await (await api.get(`Blanks/BiographyDocumentBase64/${fileBlob}`, fileBlob)).data;
    const anchor = window.document.createElement('a');
    document.body.appendChild(anchor);
    anchor.href = response;
    anchor.download = fileName;
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(anchor.href);
    return response;
  }

  export const getAchievementFile = async (fileBlob: string, fileName: string) => {
    const response = await (await api.get(`Blanks/AchievementDocumentBase64/${fileBlob}`, fileBlob)).data;
    const anchor = window.document.createElement('a');
    document.body.appendChild(anchor);
    anchor.target="_blank";
    anchor.href = response;
    anchor.download = fileName;
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(anchor.href);
    return response;
  }