/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Action, createHook, createStore } from "react-sweet-state";
import jwt from "jwt-decode";
import {
  getAnnouncementsByPage,
  pinAnnouncement,
} from "../../api/announcementsApi";
import { Announcement } from "../../models/GoverningBody/Announcement/Announcement";
import AuthStore from "../AuthStore";
import { getUserAccess } from "../../api/regionsBoardApi";
import { addSectorAnnouncement } from "../../api/governingBodySectorsApi";
import {
  addAnnouncement,
  editAnnouncement,
} from "../../api/governingBodiesApi";
import { getUsersByAllRoles } from "../../api/adminApi";
import { Roles } from "../../models/Roles/Roles";
import UserApi from "../../api/UserApi";

type State = {
  pageNumber: number;
  pageSize: number;
  announcementsCount: number;
  userAccesses: {
    [key: string]: boolean;
  };
  announcements: Announcement[];
  currentUser: any;
  usersToSendNotification: string[];
  selectedObjectId: number;
};

const initialState: State = {
  announcementsCount: 1,
  pageNumber: 1,
  pageSize: 12,
  announcements: [],
  userAccesses: {},
  currentUser: {},
  usersToSendNotification: [],
  selectedObjectId: 0,
};

const actions = {
  setSelectedObject: (id: number): Action<State> => async ({ setState }) => {
    setState({
      selectedObjectId: id,
    });
  },

  getUsersToSendMessadge: (): Action<State> => async ({ setState }) => {
    let result: any;
    await getUsersByAllRoles([[Roles.RegisteredUser]], false).then(
      (response) => {
        result = response;
      }
    );
    setState({
      usersToSendNotification: result,
    });
  },

  editAnnouncement: (
    id: number,
    title: string,
    text: string,
    images: string[],
    isPined: boolean
  ): Action<State> => async () => {
    await editAnnouncement(id, title, text, images, isPined);
  },

  addAnnouncement: (
    title: string,
    text: string,
    images: string[],
    isPined: boolean,
    gvbId: number,
    sectorId: number
  ): Action<State> => async () => {
    if (sectorId) {
      await addSectorAnnouncement(
        title,
        text,
        images,
        isPined,
        gvbId,
        +sectorId
      );
    } else {
      await addAnnouncement(title, text, images, isPined, +gvbId);
    }
  },

  pinAnnouncement: (announcementId: number): Action<State> => async ({
    setState,
    getState,
  }) => {
    await pinAnnouncement(announcementId);
    const ann: Announcement[] = getState().announcements.map((item) => {
      const announcement = item;
      if (announcement.id === announcementId) {
        announcement.isPined = !item.isPined;
      }
      return announcement;
    });
    setState({
      announcements: ann,
    });
  },

  setPageSize: (size: number): Action<State> => async ({ setState }) => {
    setState({
      pageSize: size,
    });
  },

  setCurrentPage: (page: number): Action<State> => async ({ setState }) => {
    setState({
      pageNumber: page,
    });
  },

  deleteAnnouncement: (id: number): Action<State> => async ({
    setState,
    getState,
  }) => {
    const filteredData = getState().announcements.filter((d) => d.id !== id);
    setState({
      announcements: filteredData,
    });
  },

  getUserAccesses: (): Action<State> => async ({ setState }) => {
    const user: any = jwt(AuthStore.getToken() as string);
    let result: any;
    await getUserAccess(user.nameid).then((response) => {
      result = response;
      setState({
        userAccesses: response.data,
        currentUser: user,
      });
    });
    return result;
  },

  getAnnouncements: (): Action<State> => async ({ setState, getState }) => {
    await getAnnouncementsByPage(
      getState().pageNumber,
      getState().pageSize
    ).then(async (res) => {
      const announcements: Announcement[] = [];
      for (const value of res.data.item1) {
        await UserApi.getImage(value.user.imagePath).then((image) => {
          const ann: Announcement = {
            id: value.id,
            text: value.text,
            title: value.title,
            date: value.date,
            firstName: value.user.firstName,
            lastName: value.user.lastName,
            userId: value.userId,
            profileImage: image.data,
            imagesPresent: value.imagesPresent,
            isPined: value.isPined,
          };
          announcements.push(ann);
        });
      }
      setState({
        announcements,
        announcementsCount: res.data.item2,
      });
    });
  },
};

type Actions = typeof actions;

const Store = createStore<State, Actions>({
  initialState,
  actions,
});

// eslint-disable-next-line import/prefer-default-export
export const AnnouncementsTableStore = createHook(Store);
