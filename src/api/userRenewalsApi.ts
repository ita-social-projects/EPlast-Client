import { showUserFormerInfoModal } from "../pages/UserRenewal/UserRenewalModals";
import { toggleMemberStatus } from "./citiesApi";
import api from "./api";
import UserRenewal from "../pages/UserRenewal/Types/UserRenewal";

const getUserRenewalsTableData = async (
  searchedData: string,
  page: number,
  pageSize: number,
  filter: any
) => {
  return (
    await api.get("UserRenewal/UserRenewalsForTable", {
      searchedData: searchedData,
      page: page,
      pageSize: pageSize,
      filter: filter
    })
  ).data;
};

const renewUser = async (data: UserRenewal) => {
  const response = await api
    .put("UserRenewal/RenewUser", data)
    .then((response) => {
      toggleMemberStatus(response.data.id);
    })
    .catch(() => {
      showUserFormerInfoModal("Неможливо відновити користувача.");
    });
  return response;
};

const sendUserRenewal = async (data: UserRenewal) => {
  const response = await api.post("UserRenewal/CreateRenewal", data);
  return response;
};

const checkFormer = async (email: string) => {
  let formerId: string = "";
  await api
    .post(`UserRenewal/FormerCheck/${email}`)
    .then((response) => {
      formerId = response.data;
    })
    .catch(() => {
      showUserFormerInfoModal("Користувача з даною email адресою не знайдено");
    });
  return formerId;
};

export default {
  getUserRenewalsTableData,
  renewUser,
  sendUserRenewal,
  checkFormer,
};
