import Api from "./api";
import notificationLogic from "../components/Notifications/Notification";
import {
  successfulCreateAction,
  successfulEditAction,
  successfulDeleteAction,
} from "../components/Notifications/Messages";

export type Decision = {
  id: number;
  name: string;
  governingBody: string;
  decisionStatusType: string;
  decisionTarget: string;
  description: string;
  date: string;
  userId: string;
  fileName: string | null;
};
export type FileWrapper = {
  FileAsBase64: string | null;
  FileName: string | null;
};
export type GoverningBody = {
  id: number;
  governingBodyName: string;
  logo: string | undefined;
  description: string;
  phoneNumber: string;
  email: string;
};
export type decisionTarget = {
  id: number;
  targetName: string;
};
export type decisionStatusType = {
  text: string;
  value: string;
};
export type DecisionOnCreateData = {
  governingBodies: GoverningBody[];
  decisionStatusTypeListItems: decisionStatusType[];
};
export type DecisionWrapper = {
  decision: DecisionPost;
  fileAsBase64: string | null;
};
export type DecisionPost = {
  id: number;
  name: string;
  decisionStatusType: number;
  governingBody: GoverningBody;
  decisionTarget: decisionTarget;
  description: string;
  date: string;
  userId: string;
  fileName: string | null;
};
export const statusTypePostParser = (
  statusType: string
): number => {
  if (statusType === "InReview") return 0;
  if (statusType === "Confirmed") return 1;
  return 2;
};
export const statusTypeFromStringParser = (statusType: string): number => {
  if (statusType === "У розгляді") return 0;
  if (statusType === "Потверджено") return 1;
  return 2;
};
export const statusTypeGetParser = (statusType: number): string => {
  if (statusType === 0) return "У розгляді";
  if (statusType === 1) return "Потверджено";
  if (statusType === 2) return "Скасовано";
  return "Не визначено";
};

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

const getById = async (id: number) => {
  const response: DecisionPost = await (await Api.get(`Decisions/${id}`)).data;
  return response;
};

const getAll = async () => {
  const { data } = await Api.get("Decisions");
  return data;
};

const getAllDecisionsForTable = async (
  searchedData: string,
  page: number,
  pageSize: number
) => {
  return (
    await Api.get("Decisions/DecisionsForTable", {
      searchedData: searchedData,
      page: page,
      pageSize: pageSize,
    })
  ).data;
};

const getOnCreate = async () => {
  const data: DecisionOnCreateData = await (
    await Api.get(`Decisions/NewDecision`)
  ).data;
  return data;
};

const getPdf = async (id: number) => {
  const data = await (await Api.get(`Decisions/createpdf/${id}`)).data;
  const binaryString = window.atob(data);
  const binaryLen = binaryString.length;
  const bytes = new Uint8Array(binaryLen);
  for (let i = 0; i < binaryLen; i += 1) {
    const ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  const blob = new Blob([bytes], { type: "application/pdf" });
  const link = window.URL.createObjectURL(blob);
  return link;
};

const post = async (data: any) => {
  const response = await Api.post("Decisions", data)
    .then((response) => {
      notificationLogic("success", successfulCreateAction("Рішення"));
    })
    .catch((error) => {
      notificationLogic("error", error.response.data.value);
    });
  return response;
};

const postForCheckFile = async (data: any) => {
  const response = await Api.post("Decisions/CheckFile", data).catch(
    (error) => {
      notificationLogic("error", error.response.data.value);
    }
  );
  return response;
};

const getFileAsBase64 = async (fileName: string) => {
  const response = await (await Api.get(`Decisions/downloadfile/${fileName}`))
    .data;
  const file = dataURLtoFile(response, fileName);
  const anchor = window.document.createElement("a");
  anchor.href = response;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(anchor.href);
  return response;
};

const put = async (id: number, data: DecisionPost) => {
  const response = await Api.put(`Decisions/${id}`, data)
    .then((response) => {
      notificationLogic("success", successfulEditAction("Рішення"));
    })
    .catch((error) => {
      notificationLogic("error", error.response.data.value);
    });
  return response;
};

const remove = async (id: number) => {
  const response = await Api.remove(`Decisions/${id}`)
    .then((response) => {
      notificationLogic("success", successfulDeleteAction("Рішення"));
    })
    .catch((error) => {
      notificationLogic("error", error.response.data.value);
    });
  return response;
};

const getTargetList = async (search: string) => {
  const response = await (await Api.get(`Decisions/targetList/${search}`)).data;
  return response;
};

export default {
  getById,
  getAll,
  getAllDecisionsForTable,
  getOnCreate,
  getPdf,
  getFileAsBase64,
  post,
  postForCheckFile,
  put,
  remove,
  getTargetList,
};
