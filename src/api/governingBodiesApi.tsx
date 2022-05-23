import axios from "axios";
import api from "./api";
import BASE_URL from "../config";

const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let { length } = bstr;
  const u8arr = new Uint8Array(length);

  while (length !== -1) {
    u8arr[length] = bstr.charCodeAt(length);
    length -= 1;
  }

  return new File([u8arr], filename, { type: mime });
};

export const getGoverningBodiesList = async () => {
  const { data } = await api.get("GoverningBodies");
  return data;
};

export const getGoverningBodyById = async (id: number) => {
  return await api.get(`GoverningBodies/Profile/${id}`, id).catch((error) => {
    throw new Error(error);
  });
};

export const getGoverningBodiesByPage = async (
  page: number,
  pageSize: number,
  governingBodyName: string | null = null
) => {
  return api
    .get(`GoverningBodies/Profiles/${page}`, {
      page,
      pageSize,
      governingBodyName,
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const createGoverningBody = async (data: any) => {
  return api
    .post("GoverningBodies/CreateGoverningBody", data)
    .catch((error) => {
      throw new Error(error);
    });
};

export const updateGoverningBody = async (id: number, data: any) => {
  return api
    .put(`GoverningBodies/EditGoverningBody/${id}`, data)
    .catch((error) => {
      throw new Error(error);
    });
};

export const removeGoverningBody = async (id: number) => {
  return api
    .remove(`GoverningBodies/RemoveGoverningBody/${id}`, id)
    .catch((error) => {
      throw new Error(error);
    });
};

export const getGoverningBodyLogo = async (logoName: string) => {
  return await axios
    .get(`${`${BASE_URL}GoverningBodies/LogoBase64/${logoName}`}`)
    .catch((error) => {
      throw new Error(error);
    });
};

export const getAllAdmins = async (id: number) => {
  return api.get(`GoverningBodies/Admins/${id}`).catch((error) => {
    throw new Error(error);
  });
};

export const getAllDocuments = async (id: number) => {
  return api.get(`GoverningBodies/Documents/${id}`).catch((error) => {
    throw new Error(error);
  });
};

export const addMainAdmin = async (data: any) => {
  return api.post(`GoverningBodies/AddMainAdmin`, data).catch((error) => {
    throw new Error(error);
  });
};

export const addAdministrator = async (governingBodyId: number, data: any) => {
  return api
    .post(`GoverningBodies/AddAdmin/${governingBodyId}`, data)
    .catch((error) => {
      throw new Error(error);
    });
};

export const removeAdministrator = async (adminId: number) => {
  return api
    .put(`GoverningBodies/RemoveAdmin/${adminId}`, adminId)
    .catch((error) => {
      throw new Error(error);
    });
};

export const removeMainAdministrator = async (userId: string) => {
  return api
    .put(`GoverningBodies/RemoveMainAdmin/${userId}`, userId)
    .catch((error) => {
      throw new Error(error);
    });
};

export const editAdministrator = async (adminId: number, data: any) => {
  return api
    .put(`GoverningBodies/EditAdmin/${adminId}`, data)
    .catch((error) => {
      throw new Error(error);
    });
};

export const addDocument = async (governingBodyId: number, data: any) => {
  return api
    .post(`GoverningBodies/AddDocument/${governingBodyId}`, data)
    .catch((error) => {
      throw new Error(error);
    });
};

export const removeDocument = async (documentId: number) => {
  return api
    .remove(`GoverningBodies/RemoveDocument/${documentId}`, documentId)
    .catch((error) => {
      throw new Error(error);
    });
};

export const getFile = async (fileBlob: string, fileName: string) => {
  const response = await (
    await api.get(`GoverningBodies/FileBase64/${fileBlob}`, fileBlob)
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
  return api.get(`GoverningBodies/GetDocumentTypes`).catch((error) => {
    throw new Error(error);
  });
};

export const getUserAccess = async (userId: string) => {
  return await api
    .get(`GoverningBodies/GetUserAccesses/${userId}`, userId)
    .catch((error) => {
      throw error;
    });
};

export const getUsersAdministrations = async (UserId: string) => {
  return api.get(`GoverningBodies/GetUserAdmins/${UserId}`);
};

export const getUsersPreviousAdministrations = async (UserId: string) => {
  return await api
    .get(`GoverningBodies/GetUserPreviousAdmins/${UserId}`)
    .catch((error) => {
      throw new Error(error);
    });
};

export const getAllAnnouncements = async () => {
  return await api.get("GoverningBodies/GetAllAnnouncements").catch((error) => {
    throw new Error(error);
  });
};

export const getAnnouncementsByPage = async (
  pageNumber: number,
  pageSize: number,
  governingBodyId: number
) => {
  return await api
    .get(`GoverningBodies/GetAnnouncementsByPage/${pageNumber}`, {
      pageNumber,
      pageSize,
      governingBodyId,
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const addAnnouncement = (
  title: string,
  text: string,
  ImagesBase64: string[],
  governingBodyId: number
) => {
  return api
    .post(`GoverningBodies/AddAnnouncement`, {
      title,
      text,
      ImagesBase64,
      governingBodyId,
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const getAnnouncementsById = (id: number) => {
  return api.get(`GoverningBodies/GetAnnouncement/${id}`, id).catch((error) => {
    throw new Error(error);
  });
};

export const editAnnouncement = async (
  id: number,
  title: string,
  text: string,
  imagesBase64: string[]
) => {
  return api
    .put(`GoverningBodies/EditAnnouncement/${id}`, {
      id,
      title,
      text,
      imagesBase64,
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const deleteAnnouncement = async (id: number) => {
  return api
    .remove(`GoverningBodies/DeleteAnnouncement/${id}`, id)
    .catch((error) => {
      throw new Error(error);
    });
};

export const getAllUserId = async () => {
  return await api.get("GoverningBodies/GetAllUsersId").catch((error) => {
    throw new Error(error);
  });
};

export const getGoverningBodyAdminsForTable = async (
  userId: string,
  isActive: boolean,
  pageNumber: number,
  pageSize: number
) => {
  return (
    await api.get("GoverningBodies/GetUserAdminsForTable", {
      userId: userId,
      isActive: isActive,
      pageNumber: pageNumber,
      pageSize: pageSize,
    })
  ).data;
};
