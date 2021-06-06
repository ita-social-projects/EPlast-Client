import RegionAnnualReportQuestions from "../pages/AnnualReport/Interfaces/RegionAnnualReportQuestions";
import api from "./api";

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

export const GetAllRegions = async () => {
  return await api.get("Regions/Profiles").catch((error) => {
    throw new Error(error);
  });
};

export const GetAllRegionsOptions = async () => {
  return await api.get("Regions/Options").catch((error) => {
    throw new Error(error);
  });
};

export const GetRegionsBoard = async () => {
  return await api.get("Regions/regionsBoard").catch((error) => {
    throw new Error(error);
  });
};

export const EditRegion = async (regId: number, data: any) => {
  return await api.put(`Regions/EditRegion/${regId}`, data).catch((error) => {
    throw new Error(error);
  });
};

export const addDocument = async (data: any) => {
  return api.post(`Regions/AddDocument`, data).catch((error) => {
    throw new Error(error);
  });
};

export const getRegionDocuments = async (regionId: any) => {
  return api.get(`Regions/getDocs/${regionId}`).catch((error) => {
    throw new Error(error);
  });
};

export const createRegion = async (data: any) => {
  return await api.post("Regions/AddRegion", data);
};

export const getRegionById = async (regionId: number) => {
  return await api.get(`Regions/Profile/${regionId}`);
};

export const getRegionMembersInfo = async (regionId: number, year: number) => {
  return await api.get(`Regions/MembersInfo/${regionId}/${year}`).catch((error) => {
    throw new Error(error);
  });
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

export const getHead = async (regionId: number) => {
  return api.get(`Regions/GetHead/${regionId}`).catch((error) => {
    throw new Error(error);
  });
};

export const getHeadDeputy = async (regionId: number) => {
  return api.get(`Regions/GetHeadDeputy/${regionId}`).catch((error) => {
    throw new Error(error);
  });
};

export const removeAdmin = async (id: number) => {
  return api.remove(`Regions/RemoveAdministration/${id}`, id).catch((error) => {
    throw new Error(error);
  });
};

export const getFile = async (fileBlob: string, fileName: string) => {
  const response = await (
    await api.get(`Regions/FileBase64/${fileBlob}`, fileBlob)
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

export const addFollower = async (regionId: number, cityId: number) => {
  return api
    .post(`Regions/AddFollower/${regionId}/${cityId}`)
    .catch((error) => {
      throw new Error(error);
    });
};

export const AddAdmin = async (data: any) => {
  return api.post("Regions/AddAdministrator", data);
};

export const EditAdmin = async (data: any) => {
  return api.post("Regions/EditAdministrator", data);
};

export const getRegionAdministration = async (regionId: number) => {
  return api.get(`Regions/GetAdministration/${regionId}`).catch((error) => {
    throw new Error(error);
  });
};

export const getUsersAdministrations = async (userId: string) => {
  return api.get(`Regions/GetUserAdministrations/${userId}`).catch((error) => {
    throw new Error(error);
  });
};

export const getUsersPreviousAdministrations = async (userId: string) => {
  return api
    .get(`Regions/GetUserPreviousAdministrations/${userId}`)
    .catch((error) => {
      throw new Error(error);
    });
};

export const getAdminTypes = async () => {
  return api.get(`Regions/GetAdminTypes`).catch((error) => {
    throw new Error(error);
  });
};

export const removeDocument = async (documentId: number) => {
  return api
    .remove(`Regions/RemoveDocument/${documentId}`, documentId)
    .catch((error) => {
      throw new Error(error);
    });
};

export const getRegions = async () => {
  return api.get(`Regions/Regions`)
    .catch((error) => {
      throw new Error(error);
    });
};

export const getAccessableRegions = async () => {
  return api.get(`Regions/RegionOptions`)
    .catch((error) => {
      throw new Error(error);
    });
};

export const redirectCities = async (prevRegId: number, nextRegId: number) => {
  return api
    .put(`Regions/RedirectCities/${prevRegId}/${nextRegId}`)
    .catch((error) => {
      throw new Error(error);
    });
};

export const createRegionAnnualReport = async (id: number, year: number, data: RegionAnnualReportQuestions) => {
  return api.post(`Regions/CreateRegionAnnualReportById/${id}/${year}`, JSON.stringify(data))
    .catch((error) => {
      throw error;
    })
}

export const getReportById = async (id: number, year: number) => {
  return api.get(`Regions/GetReportById/${id}/${year}`)
    .catch((error) => {
      throw new Error(error);
    })
}

export const getAllRegionsReports = async () => {
  return api.get(`Regions/GetAllRegionsReports`)
    .catch((error) => {
      throw new Error(error);
    })
}

export const getSearchedRegionsReports = async (searchedData: string, page: number, pageSize: number, sortKey: number, authReport: boolean) => {
  return api.get(`Regions/RegionsAnnualReports`,
    {
      searchedData: searchedData,
      page: page,
      pageSize: pageSize,
      sortKey: sortKey,
      auth: authReport
    })
    .catch((error) => {
      throw new Error(error);
    })
}

const confirm = async (id: number) => {
  return await api.put(`Regions/confirmReport/${id}`)
    .catch((error) => {
      throw new Error(error);
    });
}

const cancel = async (id: number) => {
  return await api.put(`Regions/cancel/${id}`)
    .catch((error) => {
      throw new Error(error);
    });
}

const editReport = async (reportId: number, data: RegionAnnualReportQuestions) => {
  return await api.put(`Regions/editReport/${reportId}`, data)
      .catch((error) => {
        throw new Error(error);
      });
}

const removeAnnualReport = async (id: number) => {
  return await api.remove(`Regions/${id}`)
    .catch((error) => {
      throw new Error(error);
    });
}

export const getRegionsByPage = async (
  page: number,
  pageSize: number,
  regionName: string | null = null
) => {
  return api
    .get(`Regions/Profiles/${page}`, { page, pageSize, regionName })
    .catch((error) => {
      throw error;
    });
};

export const getAdminTypeIdByName = async (name: string) => {
  return api.get(`Regions/GetAdminTypeId/${name}`).catch((error) => {
    throw new Error(error);
  });
};

export default {
  editReport,
  getRegionMembersInfo,
  removeAnnualReport,
  getAccessableRegions,
  cancel,
  confirm,
  getAllRegionsReports,
  getReportById,
  createRegionAnnualReport,
  getAdminTypeIdByName,
  getRegionsByPage,
  redirectCities,
  getHead,
  removeDocument,
  getRegionDocuments,
  getUsersAdministrations,
  removeAdmin,
  AddAdmin,
  EditAdmin,
  getAdminTypes,
  getRegionAdministration,
  EditRegion,
  removeRegion,
  getRegionLogo,
  getRegionById,
  GetAllRegions,
  createRegion,
  getRegions,
  GetRegionsBoard
};
