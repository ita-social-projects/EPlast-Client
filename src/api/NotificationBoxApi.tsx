import { Roles } from "../models/Roles/Roles";
import User from "../models/UserTable/User";
import adminApi from "./adminApi";
import Api from "./api";

export type NotificationType = {
  id: number;
  name: string;
};
export type UserNotification = {
  id: number;
  notificationTypeId: number;
  checked: boolean;
  message: string;
  ownerUserId: string;
  senderLink: string;
  senderName: string;
  createdAt: string;
  checkedAt?: string;
};

export type CityRegionAdminsOfUser = {
  cityRegionAdmins: Array<{
    cityName: string;
    cityAdminId: string;
    regionAdminId: string;
  }>;
  user: User;
};

const NotificationTypes = {
  Default: 0,
  EventNotifications: 0,
  UserNotifications: 0,
};

export type UserNotificationPost = {
  notificationTypeId: number;
  message: string;
  ownerUserId: string;
  senderLink: string;
  senderName: string;
};

const getAllUserNotifications = async (
  id: string
): Promise<Array<UserNotification>> => {
  const response = await Api.get(`NotificationBox/getNotifications/${id}`);

  return response.data;
};

const getAllNotificationTypes = async (): Promise<Array<NotificationType>> => {
  const response = await Api.get(`NotificationBox/getTypes`);
  InitializeNotificationTypes(response.data);
  return response.data;
};

const InitializeNotificationTypes = (types: Array<NotificationType>) => {
  const def = types.find((t) => (t.name = "Default"));
  NotificationTypes.Default = def ? def.id : 0;
  const eventNotifi = types.find((t) => (t.name = "Створення події"));
  NotificationTypes.EventNotifications = eventNotifi ? eventNotifi.id : 0;
  const userNotifi = types.find((t) => (t.name = "Додавання користувача"));
  NotificationTypes.UserNotifications = userNotifi ? userNotifi.id : 0;
};

const postUserNotifications = async (
  userNotifications: Array<UserNotificationPost>
) => {
  const response = await Api.post(
    `NotificationBox/addNotifications`,
    userNotifications
  );

  return response.data;
};

const SetCheckedAllUserNotification = async (userId: string) => {
  const response = await Api.post(
    `NotificationBox/setCheckNotifications/setChecked/${userId}`
  );

  return response.data;
};

const removeUserNotifications = async (userId: string) => {
  const response = await Api.remove(
    `NotificationBox/removeAllNotifications/${userId}`
  );

  return response.data;
};

const removeNotification = async (notificationId: number) => {
  const response = await Api.remove(
    `NotificationBox/removeNotification/${notificationId}`
  );
  return response.data;
};

const createNotifications = async (
  userIds: Array<string>,
  message: string,
  NotifiType: number,
  senderLink?: string,
  senderName?: string
) => {
  let notifications: UserNotificationPost[] = [];

  for (let i = 0; i < userIds.length; i++) {
    if (userIds[i] != null) {
      notifications.push({
        notificationTypeId:
          NotifiType !== 0 ? NotifiType : NotificationTypes.Default,
        message: message,
        ownerUserId: userIds[i],
        senderLink: senderLink ? senderLink : "",
        senderName: senderName ? senderName : "",
      });
    }
  }

  await postUserNotifications(notifications);
};

const getCitiesForUserAdmins = async (
  userId: string
): Promise<CityRegionAdminsOfUser> => {
  const cityRegionAdminsOfUser: CityRegionAdminsOfUser = {
    cityRegionAdmins: [],
    user: new User(),
  };

  await adminApi
    .getCityRegionAdmins(userId)
    .then((res) => {
      res.data.result.forEach((c: any) => {
        cityRegionAdminsOfUser.cityRegionAdmins.push({
          cityName: c.name,
          cityAdminId: c.cityAdministration
            .reverse()
            .find((ca: any) => ca.adminType.adminTypeName === Roles.CityHead)
            ?.userId,
          regionAdminId: c.region.administration
            .reverse()
            .find((ra: any) => ra.adminType.adminTypeName === Roles.OkrugaHead)
            ?.userId,
        });
      });
      cityRegionAdminsOfUser.user = res.data.user;
    })
    .catch((e) => console.log(e));
  return cityRegionAdminsOfUser;
};

export default {
  NotificationTypes,
  getCitiesForUserAdmins,
  createNotifications,
  removeUserNotifications,
  removeNotification,
  postUserNotifications,
  SetCheckedAllUserNotification,
  getAllNotificationTypes,
  getAllUserNotifications,
};
