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

export const addDocument = async (userId: number, data: any) => {
    return api.post(`Blanks/AddDocument/${userId}`, data).catch((error) => {
      throw new Error(error);
    });
  }

export const getDocumentByUserId = async (userId:string) => {
    return api.get(`Blanks/GetDocumentByUserId/${userId}/`).catch((error) => {
      throw new Error(error);
    });
  }

  export const removeDocument = async (documentId: number) => {
    return api.remove(`Blanks/RemoveBiographyDocument/${documentId}`, documentId).catch((error) => {
      throw new Error(error);
    });
  }

  export const getFile = async (fileBlob: string, fileName: string) => {
    const response = await (await api.get(`Blanks/BiographyDocumentBase64/${fileBlob}`, fileBlob)).data;
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