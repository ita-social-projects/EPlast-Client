import axios from "axios";
import api from "./api";
import BASE_URL from "../config";

const dataURLtoFile = (dataUrl: string, fileName: string) => {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let { length } = bstr;
  const u8arr = new Uint8Array(length);

  while (length !== -1) {
    u8arr[length] = bstr.charCodeAt(length);
    length -= 1;
  }

  return new File([u8arr], fileName, { type: mime });
};

export const getSectorsListByGoverningBodyId = async (
  governingBodyId: number
) => {
  const { data } = await api.get(
    "GoverningBodies/Sectors/" + governingBodyId,
    governingBodyId
  );
  return data;
};

export const getSectorById = async (id: number) => {
  return await api
    .get(`GoverningBodies/Sectors/Profile/${id}`,id)
    .catch((error) => {
      throw new Error(error);
    });
};

export const getSectorsByPage = async (
  governingBodyId: number,
  page: number,
  pageSize: number,
  name: string | null = null
) => {
  return api
    .get(`GoverningBodies/${governingBodyId}/Sectors/Profiles/${page}`, {
      page,
      pageSize,
      name,
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const createSector = async (data: any) => {
  return api
    .post("GoverningBodies/Sectors/CreateSector", data)
    .catch((error) => {
      throw new Error(error);
    });
};

export const updateSector = async (id: number, data: any) => {
  return api
    .put(`GoverningBodies/Sectors/EditSector/${id}`, data)
    .catch((error) => {
      throw new Error(error);
    });
};

export const removeSector = async (id: number) => {
  return api
    .remove(`GoverningBodies/Sectors/RemoveSector/${id}`, id)
    .catch((error) => {
      throw new Error(error);
    });
};

export const getSectorLogo = async (logoName: string | null) => {
  return await axios
    .get(BASE_URL + "GoverningBodies/Sectors/LogoBase64/" + logoName, {
      params: logoName,
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const getAllAdmins = async (sectorId: number) => {
  return api
    .get("GoverningBodies/Sectors/Admins/" + sectorId, sectorId)
    .catch((error) => {
      throw new Error(error);
    });
};

export const getAllDocuments = async (sectorId: number) => {
  return api
    .get(`GoverningBodies/Sectors/Documents/${sectorId}`)
    .catch((error) => {
      throw new Error(error);
    });
};

export const addAdministrator = async (sectorId: number, data: any) => {
  return api
    .post("GoverningBodies/Sectors/AddAdmin/" + sectorId, data)
    .catch((error) => {
      throw new Error(error);
    });
};

export const removeAdministrator = async (adminId: number) => {
  return api
    .put(`GoverningBodies/Sectors/RemoveAdmin/${adminId}`, adminId)
    .catch((error) => {
      throw new Error(error);
    });
};

export const editAdministrator = async (adminId: number, data: any) => {
  return api
    .put(`GoverningBodies/Sectors/EditAdmin/${adminId}`, data)
    .catch((error) => {
      throw new Error(error);
    });
};

export const addDocument = async (sectorId: number, data: any) => {
  return api
    .post(`GoverningBodies/Sectors/AddDocument/${sectorId}`, data)
    .catch((error) => {
      throw new Error(error);
    });
};

export const removeDocument = async (documentId: number) => {
  return api
    .remove(`GoverningBodies/Sectors/RemoveDocument/${documentId}`, documentId)
    .catch((error) => {
      throw new Error(error);
    });
};

export const getFile = async (fileBlob: string, fileName: string) => {
  const response = await (
    await api.get(`GoverningBodies/Sectors/FileBase64/${fileBlob}`, fileBlob)
  ).data;
  const file = dataURLtoFile(response, fileBlob);
  const anchor = window.document.createElement("a");
  anchor.href = window.URL.createObjectURL(file);
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(anchor.href);
  return response;
};

export const getDocumentTypes = async () => {
  return api.get(`GoverningBodies/Sectors/GetDocumentTypes`).catch((error) => {
    throw new Error(error);
  });
};

export const getUserAccess = async (userId: string) => {
  return await api
    .get(`GoverningBodies/Sectors/GetUserAccesses/${userId}`, userId)
    .catch((error) => {
      throw error;
    });
};

export const getUsersAdministrations = async (UserId: string) => {
  return api.get(`GoverningBodies/Sectors/GetUserAdmins/${UserId}`);
};

export const getUsersPreviousAdministrations = async (UserId: string) => {
  return await api
    .get(`GoverningBodies/Sectors/GetUserPreviousAdmins/${UserId}`)
    .catch((error) => {
      throw new Error(error);
    });
};

export const getSectorAdminsForTable = async (
  userId: string,
  isActive: boolean,
  pageNumber: number,
  pageSize: number
) => {
  return (
    await api.get("GoverningBodies/Sectors/GetUserAdminsForTable", {
      userId: userId,
      isActive: isActive,
      pageNumber: pageNumber,
      pageSize: pageSize,
    })
  ).data;
};

export const getSectorAnnouncementsByPage = async (
  pageNumber: number,
  pageSize: number,
  sectorId: number
) => {
  return await api
    .get(`GoverningBodies/Sectors/GetAnnouncementsByPage/${pageNumber}`, {
      pageNumber,
      pageSize,
      sectorId,
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const addSectorAnnouncement = (title: string, text: string, ImagesBase64: string[], sectorId: number) => {
  return api
    .post(`GoverningBodies/Sectors/AddAnnouncement`, { title, text, ImagesBase64, sectorId })
    .catch((error) => {
      throw new Error(error);
    });
};

export const getSectorAnnouncementsById = (id: number) => {
  return api.get(`GoverningBodies/Sectors/GetAnnouncement/${id}`, id).catch((error) => {
    throw new Error(error);
  });
};

export const editSectorAnnouncement = async (
  id: number,
  title: string,
  text: string,
  imagesBase64: string[]
) => {
  return api
    .put(`GoverningBodies/Sectors/EditAnnouncement/${id}`, { id, title, text, imagesBase64 })
    .catch((error) => {
      throw new Error(error);
    });
};

export const deleteSectorAnnouncement = async (id: number) => {
  return api
    .remove(`GoverningBodies/Sectors/DeleteAnnouncement/${id}`, id)
    .catch((error) => {
      throw new Error(error);
    });
};
