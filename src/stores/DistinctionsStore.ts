import jwt from "jwt-decode";
import {
  Action,
  createActionsHook,
  createHook,
  createStore,
  defaults
} from "react-sweet-state";
import distinctionApi from "../api/distinctionApi";
import NotificationBoxApi from "../api/NotificationBoxApi";
import precautionApi from "../api/precautionApi";
import AuthLocalStorage from "../AuthLocalStorage";
import {
  failCreateAction,
  failDeleteAction,
  failEditAction,
  failGetAction,
  successfulDeleteAction
} from "../components/Notifications/Messages";
import notificationLogic from "../components/Notifications/Notification";
import Distinction from "../models/Distinction/Distinction";
import DistinctionTableSettings from "../models/Distinction/DistinctionTableSettings";
import UserDistinction from "../models/Distinction/UserDistinction";
import User from "../models/UserTable/User";
import UserDistinctionEdit from "../pages/Distinction/Interfaces/UserDistinctionEdit";
import UserDistinctionTableInfo from "../pages/Distinction/Interfaces/UserDistinctionTableInfo";
defaults.devtools = true;

type State = {
  usersWithoutPrecautions: User[];
  currentUserDistinction: UserDistinctionTableInfo;
  userDistinctionsAccess: { [key: string]: boolean };
  userDistinctions: UserDistinctionTableInfo[];
  distinctionTableSettings: DistinctionTableSettings;
  distinctionTypes: Distinction[];
  editUserDistinctionFormIsVisible: boolean;
  editedUserDistinction: UserDistinction;
  editDistinctionIsVisible: boolean;
  addUserDistinctionModalIsVisible: boolean;
  editedDistinction: Distinction;
  modalSelectedDistinction: Distinction;
  editDistinctionTypesModalIsVisible: boolean;
  deleteModalIsVisible: boolean;
  deleteDitinctionId: number;
  isLoadingUserDistinctionsTable: boolean;
  isLoadingUsersWithoutPrecautions: boolean;
  isLoadingDistinctionTypes: boolean;
};

type Actions = typeof actions;

const emptyUserDistinctionTableInfo: UserDistinctionTableInfo = {
  count: 0,
  total: 0,
  id: 0,
  number: 0,
  distinctionName: "",
  userId: "",
  userName: "",
  reporter: "",
  reason: "",
  date: new Date(),
};

const initialState: State = {
  userDistinctions: [],
  distinctionTypes: [],
  editDistinctionIsVisible: false,
  editedDistinction: new Distinction(),
  deleteModalIsVisible: false,
  deleteDitinctionId: 0,
  distinctionTableSettings: {
    sortByOrder: ["number", "ascend"],
    searchedData: "",
    page: 1,
    pageSize: 10,
  },
  editUserDistinctionFormIsVisible: false,
  addUserDistinctionModalIsVisible: false,
  editedUserDistinction: new UserDistinction(),
  userDistinctionsAccess: {},
  editDistinctionTypesModalIsVisible: false,
  currentUserDistinction: emptyUserDistinctionTableInfo,
  isLoadingUsersWithoutPrecautions: false,
  usersWithoutPrecautions: [],
  isLoadingDistinctionTypes: false,
  modalSelectedDistinction: new Distinction(),
  isLoadingUserDistinctionsTable: false
};

const CreateDeleteNotification = (id: number): Action<State> => async ({
  getState,
}) => {
  const userDistinction = getState().userDistinctions.find(
    (d: { id: number }) => d.id === id
  );
  if (userDistinction) {
    NotificationBoxApi.createNotifications(
      [userDistinction.userId],
      `Ваше відзначення: '${userDistinction.distinctionName}' було видалено.`,
      NotificationBoxApi.NotificationTypes.UserNotifications
    );
    NotificationBoxApi.getCitiesForUserAdmins(userDistinction.userId).then(
      (res) => {
        res.cityRegionAdmins.length !== 0 &&
          res.cityRegionAdmins.forEach(async (cra) => {
            await NotificationBoxApi.createNotifications(
              [cra.cityAdminId, cra.regionAdminId],
              `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' був позбавлений відзначення: '${userDistinction.distinctionName}'. `,
              NotificationBoxApi.NotificationTypes.UserNotifications
            );
          });
      }
    );
  }
};

const CreateEditNotification = (
  userId: string,
  name: string
): Action<State> => async () => {
  if (userId !== "" && name !== "") {
    NotificationBoxApi.createNotifications(
      [userId],
      `Ваше відзначення: '${name}' було змінено. `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/distinctions`,
      `Переглянути`
    );
    NotificationBoxApi.getCitiesForUserAdmins(userId).then((res) => {
      res.cityRegionAdmins.length !== 0 &&
        res.cityRegionAdmins.forEach(async (cra) => {
          await NotificationBoxApi.createNotifications(
            [cra.cityAdminId, cra.regionAdminId],
            `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' отримав змінене відзначення: '${name}'. `,
            NotificationBoxApi.NotificationTypes.UserNotifications,
            `/distinctions`,
            `Переглянути`
          );
        });
    });
  }
};

const CreateAddNotifications = (
  userDistinction: UserDistinction
): Action<State> => async () => {
  await NotificationBoxApi.createNotifications(
    [userDistinction.userId],
    `Вам було надано нове відзначення: '${userDistinction.distinction.name}' від ${userDistinction.reporter}. `,
    NotificationBoxApi.NotificationTypes.UserNotifications,
    `/distinctions`,
    `Переглянути`
  );

  await NotificationBoxApi.getCitiesForUserAdmins(userDistinction.userId).then(
    (res) => {
      res.cityRegionAdmins.length !== 0 &&
        res.cityRegionAdmins.forEach(async (cra) => {
          await NotificationBoxApi.createNotifications(
            [cra.cityAdminId, cra.regionAdminId],
            `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' отримав нове відзначення: '${userDistinction.distinction.name}' від ${userDistinction.reporter}. `,
            NotificationBoxApi.NotificationTypes.UserNotifications,
            `/distinctions`,
            `Переглянути`
          );
        });
    }
  );
};

const actions = {
  setTableSettings: (res: any): Action<State> => ({ setState, getState }) => {
    setState({
      distinctionTableSettings: {
        ...getState().distinctionTableSettings,
        page: res[0].current,
        pageSize: res[0].pageSize,
      },
    });

    res[2].order === null
      ? setState({
          distinctionTableSettings: {
            ...getState().distinctionTableSettings,
            sortByOrder: [res[2].field, null],
          },
        })
      : setState({
          distinctionTableSettings: {
            ...getState().distinctionTableSettings,
            sortByOrder: [res[2].field, res[2].order],
          },
        });
  },

  setLoadingUsersWithoutPrecautions: (
    isUsersLoading: boolean
  ): Action<State> => ({ setState }) => {
    setState({ isLoadingUsersWithoutPrecautions: isUsersLoading });
  },

  setLoadingDistinctionTypes: (isFormLoading: boolean): Action<State> => ({
    setState,
  }) => {
    setState({
      isLoadingDistinctionTypes: isFormLoading,
    });
  },

  setLoadingUserDistinctionsTable: (isTableLoading: boolean): Action<State> => ({
    setState,
  }) => {
    setState({
      isLoadingUserDistinctionsTable: isTableLoading,
    });
  },

  setCurrentUserDistinction: (
    userDistinction: UserDistinctionTableInfo
  ): Action<State> => ({ setState }) => {
    setState({
      currentUserDistinction: userDistinction,
    });
  },

  getUserDistinctionsAccess: (): Action<State> => ({ setState }) => {
    let user: any = jwt(AuthLocalStorage.getToken() as string);
    distinctionApi
      .getUserDistinctionAccess(user.nameid)
      .then((response) => {
        setState({ userDistinctionsAccess: response.data });
      })
      .catch(() =>
        notificationLogic(
          "error",
          failGetAction("права доступа для сторінки. Спробуйте пізніше")
        )
      );
  },

  getUsersWithoutPrecautions: (): Action<State> => ({ setState, dispatch }) => {
    precautionApi
      .getUsersWithoutPrecautions()
      .then((response) => {
        setState({
          usersWithoutPrecautions: response.data,
        });
        dispatch(actions.setLoadingUsersWithoutPrecautions(false));
      })
      .catch(() =>
        notificationLogic(
          "error",
          failGetAction("список користувачів. Спробуйте пізніше")
        )
      );
  },

  fetchUserDistinctions: (): Action<State> => ({ setState, getState,dispatch }) => {
    distinctionApi
      .getAllUsersDistinctions(getState().distinctionTableSettings)
      .then((response) => {
        setState({ userDistinctions: response });
        dispatch(actions.setLoadingUserDistinctionsTable(false));
      })
      .catch(() => {
        notificationLogic(
          "error",
          failGetAction("відзначення користувачів. Спробуйте пізніше")
        );
      });
  },

  setSearch: (searchedData: string): Action<State> => ({
    setState,
    getState,
  }) => {
    setState({
      distinctionTableSettings: {
        ...getState().distinctionTableSettings,
        page: 1,
        searchedData: searchedData,
      },
    });
  },

  setPage: (page: number): Action<State> => ({ setState, getState }) => {
    setState({
      distinctionTableSettings: {
        ...getState().distinctionTableSettings,
        page: page,
      },
    });
  },

  setEditModalSelectedDistinction: (distinction: any): Action<State> => ({
    setState,
  }) => {
    setState({ modalSelectedDistinction: distinction });
  },

  addUserDistinction: (userDistinction: UserDistinction): Action<State> => ({
    dispatch,
  }) => {
    distinctionApi
      .addUserDistinction(userDistinction)
      .then(() => {
        dispatch(CreateAddNotifications(userDistinction));
        notificationLogic("success", "Відзначення користувача додано!");
        dispatch(actions.fetchUserDistinctions());
      })
      .catch(() => {
        notificationLogic("error", failCreateAction("відзначення."));
      });
  },

  editUserDistinction: (
    userDistinction: UserDistinctionEdit
  ): Action<State> => ({ getState, dispatch }) => {
    distinctionApi
      .editUserDistinction(userDistinction)
      .then(() => {
        dispatch(
          CreateEditNotification(
            userDistinction.userId,
            getState().modalSelectedDistinction.name
          )
        );
        dispatch(actions.setEditModalSelectedDistinction(new Distinction()));
        notificationLogic("success", "Відзначення користувача змінено!");
        dispatch(actions.fetchUserDistinctions());
      })
      .catch(() => {
        notificationLogic("error", failEditAction("відзначення."));
      });
  },

  deleteUserDistinction: (userDistinctionId: number): Action<State> => ({
    setState,
    getState,
    dispatch,
  }) => {
    distinctionApi
      .deleteUserDistinction(userDistinctionId)
      .then(() => {
        dispatch(CreateDeleteNotification(userDistinctionId));
        notificationLogic(
          "success",
          successfulDeleteAction("Відзначення користувача")
        );
        setState({
          userDistinctions: getState().userDistinctions.filter(
            (d: UserDistinctionTableInfo) => d.id !== userDistinctionId
          ),
        });
        if (
          getState().distinctionTableSettings.page != 1 &&
          getState().userDistinctions.length == 1
        ) {
          dispatch(
            actions.setPage(getState().distinctionTableSettings.page - 1)
          );
        }
      })
      .catch(() => {
        notificationLogic("error", failDeleteAction("відзначення."));
      });
  },

  fetchDistinctions: (): Action<State> => ({ setState, dispatch }) => {
    distinctionApi
      .getDistinctions()
      .then((response) => {
        setState({ distinctionTypes: response.data });
        dispatch(actions.setLoadingDistinctionTypes(false));
      })
      .catch(() => {
        notificationLogic(
          "error",
          failGetAction("типи відзначень. Спробуйте пізніше")
        );
      });
  },

  openUserDistinctionAddModal: (): Action<State> => ({
    setState,
    dispatch,
  }) => {
    setState({
      addUserDistinctionModalIsVisible: true,
    });
    dispatch(actions.setLoadingDistinctionTypes(true));
    dispatch(actions.setLoadingUsersWithoutPrecautions(true));
  },

  closeUserDistinctionAddModal: (): Action<State> => ({ setState }) => {
    setState({
      addUserDistinctionModalIsVisible: false,
    });
  },

  openUserDistinctionEditModal: (): Action<State> => ({
    setState,
    getState,
    dispatch,
  }) => {
    distinctionApi
      .getUserDistinctionById(getState().currentUserDistinction.id)
      .then((response) => {
        setState({
          editUserDistinctionFormIsVisible: true,
          editedUserDistinction: response.data,
        });
        dispatch(actions.setLoadingDistinctionTypes(true));
        dispatch(actions.setLoadingUsersWithoutPrecautions(true));
      })
      .catch(() => notificationLogic("error", failGetAction("відзначення.")));
  },

  closeUserDistinctionEditModal: (): Action<State> => ({ setState }) => {
    setState({
      editUserDistinctionFormIsVisible: false,
    });
  },

  openDistinctionEditForm: (distinction: Distinction): Action<State> => ({
    setState,
  }) => {
    setState({
      editDistinctionIsVisible: true,
      editedDistinction: distinction,
    });
  },

  closeDistinctionEditForm: (): Action<State> => ({ setState }) => {
    setState({
      editDistinctionIsVisible: false,
      editedDistinction: new Distinction(),
    });
  },

  closeEditDistinctionTypesModal: (): Action<State> => ({
    setState,
    dispatch,
  }) => {
    setState({ editDistinctionTypesModalIsVisible: false });
    dispatch(actions.closeDistinctionEditForm());
    dispatch(actions.openUserDistinctionAddModal());
  },

  openEditDistinctionTypesModal: (): Action<State> => ({
    setState,
    dispatch,
  }) => {
    dispatch(actions.closeUserDistinctionAddModal());
    setState({ editDistinctionTypesModalIsVisible: true });
  },

  addDistinction: (distinction: Distinction): Action<State> => ({
    dispatch,
  }) => {
    distinctionApi
      .addDistinction(distinction)
      .then(() => {
        notificationLogic("success", "Тип відзначення додано!");
        dispatch(actions.fetchDistinctions());
      })
      .catch(() => {
        notificationLogic("error", failCreateAction("тип відзначення."));
      });
  },

  editDistinction: (distinction: Distinction): Action<State> => ({
    dispatch,
  }) => {
    distinctionApi
      .editDistinction(distinction)
      .then(() => {
        dispatch(actions.fetchDistinctions());
        dispatch(actions.fetchUserDistinctions());
        dispatch(actions.closeDistinctionEditForm());
        notificationLogic("success", "Тип відзначення змінено!");
      })
      .catch(() => {
        notificationLogic("error", failEditAction("тип відзначення."));
      });
  },

  deleteDistinction: (distinctionId: number): Action<State> => ({
    getState,
    setState,
    dispatch,
  }) => {
    distinctionApi
      .deleteDistinction(distinctionId)
      .then(() => {
        dispatch(actions.closeDistinctionEditForm());
        notificationLogic("success", "Тип відзначення видалено!");
        setState({
          distinctionTypes: getState().distinctionTypes.filter(
            (d) => d.id !== distinctionId
          ),
        });
        dispatch(actions.fetchUserDistinctions());
      })
      .catch(() => {
        notificationLogic("error", failDeleteAction("тип відзначення."));
      });
  },
};

const store = createStore<State, Actions>({
  initialState,
  actions,
});

export const useDistinctions = createHook(store);
export const useDistinctionsActions = createActionsHook(store);
