import api from "./api";

export const addDocument = async (userId: number, data: any) => {
  return api.post(`Blanks/AddDocument/${userId}`, data).catch((error) => {
    throw new Error(error);
  });
}
export const addAchievementDocuments = async (userId: number, data: any) => {
  return api.post(`Blanks/AddAchievementDocumet/${userId}`, data).catch((error) => {
    throw new Error(error);
  });
}
export const addExtractFromUPU = async (userId: number, data: any) => {
  return api.post(`Blanks/AddExtractFromUPUDocument/${userId}`, data).catch((error) => {
    throw new Error(error);
  });
}

export const getDocumentByUserId = async (userId: string) => {
  return api.get(`Blanks/GetDocumentByUserId/${userId}`);
}

export const getExtractFromUPUByUserId = async (userId: string) => {
  return api.get(`Blanks/GetExtractFromUPUDocumentByUserId/${userId}`);
}

export const getAllAchievementDocumentsByUserId = async (userId: string) => {
  return api.get(`Blanks/GetAchievementDocumentsByUserId/${userId}`);
}

export const getAchievementsByPage = async (pageNumber: number, pageSize: number, userId: string) => {
  const response = await api.get(`Blanks/InfinityScroll`, { pageNumber, pageSize, userId });
  return response;
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
export const removeExtractFromUPUDocument = async (documentId: number) => {
  return api.remove(`Blanks/RemoveExtractFromUPUDocument/${documentId}`, documentId).catch((error) => {
    throw new Error(error);
  });
}

export const openBiographyFile = async (fileBlob: string) => {
  const response = await (await api.get(`Blanks/BiographyDocumentBase64/${fileBlob}`, fileBlob)).data;
  const base64 = response.split(",")[1];
  let pdfWindow = window.open("");
  pdfWindow?.document.write("<iframe width='99%' height='99%' src='data:application/pdf;base64," +
    encodeURI(base64) + "'></iframe>")
}

export const openGenerationFile = async (userId: string) => {
  const response = await (await api.get(`Blanks/getGenerationFile/${userId}`, userId)).data;
  const binaryString = window.atob(response);
  const binaryLen = binaryString.length;
  const bytes = new Uint8Array(binaryLen);
  for (let i = 0; i < binaryLen; i += 1) {
    const ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
    };
  const blob = new Blob([bytes], {type: "application/pdf"});
  const link = window.URL.createObjectURL(blob);
  return  link;
}

export const openExtractFromUPUFile = async(fileBlob:string)=>{
  const response = await (await api.get(`Blanks/ExtractFromUPUDocumentBase64/${fileBlob}`, fileBlob)).data;
  const base64 = response.split(",")[1];
  let pdfWindow = window.open("");
  pdfWindow?.document.write("<iframe width='99%' height='99%' src='data:application/pdf;base64," +
    encodeURI(base64) + "'></iframe>")
}

export const openAchievemetFile = async (fileBlob: string, fileName: string) => {
  const response = await (await api.get(`Blanks/AchievementDocumentBase64/${fileBlob}`, fileBlob)).data;
  const format = fileName.split(".")[1];
  const base64 = response.split(",")[1];
  if (format === "png" || format === "jpg" || format === "jpeg") {
    var image = new Image();
    image.src = `data:image/${format};base64,` + base64;
    var w = window.open("");
    w?.document.write(image.outerHTML);
  } else {
    let pdfWindow = window.open("");
    pdfWindow?.document.write("<iframe width='99%' height='99%' src='data:application/pdf;base64," +
      encodeURI(base64) + "'></iframe>")
  }
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
  anchor.target = "_blank";
  anchor.href = response;
  anchor.download = fileName;
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(anchor.href);
  return response;
}

export const getExtractFromUPUFile = async(fileBlob:string,fileName:string)=>{
  const response = await (await api.get(`Blanks/ExtractFromUPUDocumentBase64/${fileBlob}`, fileBlob)).data;
  const anchor = window.document.createElement('a');
  document.body.appendChild(anchor);
  anchor.target = "_blank";
  anchor.href = response;
  anchor.download = fileName;
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(anchor.href);
  return response;
}